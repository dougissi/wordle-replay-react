import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const MARKDOWN_FOLDER = '/markdown';

function Markdown({ fileName }) {
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        async function fetchMarkdownContent() {
            try {
                const response = await fetch(`${MARKDOWN_FOLDER}/${fileName}`);
                const markdown = await response.text();
                setMarkdownContent(markdown);
            } catch (error) {
                console.error('Error fetching Markdown content:', error);
            }
        }

        fetchMarkdownContent();
    }, [fileName]);

    return (
        <div className="Markdown">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
    );
}

export default Markdown;