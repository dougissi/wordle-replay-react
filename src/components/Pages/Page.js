export default function Page({ title, content }) {
    return (
        <div className={`${title}Page`}>
            <h1>{title}</h1>
            {content}
        </div>
    );
}