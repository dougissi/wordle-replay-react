import datetime as dt
import requests
import argparse
import re
from pathlib import Path
import sys

# Tự động xác định đường dẫn file JS dựa trên vị trí của script này.
# Giả định script nằm trong /auto_update và file JS nằm trong /src/assets
SCRIPT_DIR = Path(__file__).parent
DEFAULT_WORD_FILE = SCRIPT_DIR.parent / "src" / "assets" / "date_to_word.js"

def get_latest_date_from_file(file_path: Path) -> dt.date | None:
    """Phân tích file JS để tìm ngày cuối cùng đã có một cách an toàn."""
    if not file_path.exists():
        print(f"Lỗi: Không tìm thấy file tại '{file_path}'")
        return None

    # Biểu thức chính quy để tìm ngày, chấp nhận cả dấu nháy đơn và kép: ['2022-06-20', ...] hoặc ["2022-06-20", ...]
    date_pattern = re.compile(r"\[['\"](\d{4}-\d{2}-\d{2})['\"],")
    latest_date = None

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        dates_found = date_pattern.findall(content)
        if not dates_found:
            return None
        
        # Tìm ngày mới nhất trong tất cả các ngày tìm được
        latest_datestr = max(dates_found)
        return dt.datetime.strptime(latest_datestr, "%Y-%m-%d").date()

def fetch_wordle_solution(date: dt.date) -> str | None:
    """Lấy đáp án Wordle cho một ngày cụ thể từ API của NYT với xử lý lỗi."""
    url = f'https://www.nytimes.com/svc/wordle/v2/{date}.json'
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Báo lỗi nếu status code là 4xx hoặc 5xx
        data = response.json()
        solution = data.get('solution')
        if solution:
            if solution.isupper():
                print(f"\tCảnh báo: Đáp án cho ngày {date} là chữ hoa: {solution}")
            return solution
        else:
            print(f"\tLỗi: Không tìm thấy key 'solution' cho ngày {date}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"\tLỗi: Không thể lấy từ cho ngày {date}. Lý do: {e}")
        return None

def update_word_list_file(file_path: Path, new_entries: list[str]):
    """Chèn các dòng mới vào file JS một cách an toàn."""
    
    # 1. Đọc toàn bộ nội dung file vào bộ nhớ
    original_lines = []
    if file_path.exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            original_lines = f.readlines()
    else:
        print(f"Lỗi: File '{file_path}' không tồn tại để cập nhật.")
        return

    modified_lines = list(original_lines) # Tạo một bản sao để chỉnh sửa

        # Tìm vị trí của dấu `];` để chèn các dòng mới vào trước nó
        # Sửa đổi để tìm chính xác chuỗi `]);` sau khi loại bỏ khoảng trắng thừa
    found_index = -1
    for i, line in reversed(list(enumerate(modified_lines))):
            if line.strip() == ']);': # So sánh với chuỗi ']);' sau khi loại bỏ khoảng trắng
                found_index = i
                break
        
    if found_index != -1:
        modified_lines[found_index:found_index] = new_entries
    else:
        print(f"Cảnh báo: Không tìm thấy dòng ']);' trong file {file_path}. Các từ mới không được thêm vào.")
        return
            
    # 4. Mở file ở chế độ 'w' (ghi đè hoàn toàn) và ghi nội dung đã sửa đổi
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(modified_lines)

def main():
    parser = argparse.ArgumentParser(description="Lấy các từ Wordle mới từ API của NYT và cập nhật file.")
    parser.add_argument('-d', '--date', help="Lấy từ cho đến ngày này (định dạng YYYY-MM-DD). Mặc định là ngày mai.")
    parser.add_argument('-f', '--file', help=f"Đường dẫn tới file date_to_word.js. Mặc định: {DEFAULT_WORD_FILE}", default=DEFAULT_WORD_FILE, type=Path)
    args = parser.parse_args()

    target_date = (dt.date.today() + dt.timedelta(days=1)) if args.date is None else dt.datetime.strptime(args.date, "%Y-%m-%d").date()
    
    prev_latest_date = get_latest_date_from_file(args.file)
    if prev_latest_date is None:
        print("Không thể xác định ngày cuối cùng từ file. Đang thoát.")
        sys.exit(1)

    if prev_latest_date >= target_date:
        print(f"Danh sách từ đã được cập nhật đến ngày {target_date}. Không cần làm gì cả.")
        return

    print(f"Ngày cuối cùng trong file: {prev_latest_date}. Đang lấy từ cho đến ngày {target_date}.")
    new_entries = []
    current_date = prev_latest_date
    while current_date < target_date:
        current_date += dt.timedelta(days=1)
        solution = fetch_wordle_solution(current_date)
        if solution:
            new_entries.append(f"    ['{current_date}', '{solution}'],\n")
            print(f"Đã lấy từ cho ngày {current_date}: {solution}")

    if new_entries:
        update_word_list_file(args.file, new_entries)
        print("\nCập nhật danh sách từ thành công.")
    else:
        print("\nKhông có từ mới nào được lấy về.")

if __name__ == "__main__":
    main()
