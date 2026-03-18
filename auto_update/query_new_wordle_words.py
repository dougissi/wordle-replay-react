import datetime as dt
import requests
import argparse


date_to_word_file = "/Users/dissi/Documents/CodeProjects/Wordle/wordle-replay-react/src/assets/date_to_word.js"

parser = argparse.ArgumentParser()
parser.add_argument('-d', '--date', help="YYYY-MM-DD format")
args = parser.parse_args()

if args.date is None:
    tomorrow = dt.date.today() + dt.timedelta(days=1)
else:
    tomorrow = dt.datetime.strptime(args.date, "%Y-%m-%d").date()


### NOTE: ensure latest changes already fetched!

with open(date_to_word_file) as f:
    lines = list(f.readlines())
    new_lines = list(lines)  # copy
    last_line = new_lines.pop()

    prev_latest_datestr = new_lines[-1].split("['")[1].split("', ")[0]
    prev_latest_date = dt.datetime.strptime(prev_latest_datestr, "%Y-%m-%d").date()


if prev_latest_date >= tomorrow:
    print(f"word for {tomorrow} already added")
else:
    print("previous latest date:", prev_latest_date)

    date = prev_latest_date
    while date < tomorrow:
        date += dt.timedelta(days=1)

        response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{date}.json')
        # print(response)
        data = response.json()
        # print(data)
        new_lines.append(f"    ['{date}', '{data['solution']}'],\n")
        if data['solution'].isupper(): 
            print(f"\tWARNING: {date} is all uppercase")
        print(f"retrieved word for {date}")


    with open(date_to_word_file, 'w') as f:
        for line in new_lines:
            f.write(line)
        f.write(last_line)

    print("word list updated locally")

