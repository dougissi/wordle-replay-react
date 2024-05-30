import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import dayjs from 'dayjs';

function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function News() {
    const posts = [
        {
            id: 1,
            date: "2024-05-29",
            title: "Wordle Replay React",
            fileName: "news1.md"
        },
        {
            id: 2,
            date: "2024-03-18",
            title: "Doug is Cool",
            fileName: "news2.md"
        },
        {
            id: 3,
            date: "2020-10-10",
            title: "Something Else",
            fileName: "news10.md"
        }
    ];

    const newsPostId = (post) => `news-post${post.id}`;
    const postTitleWithDate = (post) => `${post.title} — ${dayjs(post.date).format('LL')}`;

    return (
        <div className="News">
            <h1>News</h1>

            {/* TOC */}
            <List style={{ padding: '20px' }}>
                {posts.map(post => (
                    <ListItemButton 
                        key={`news-post-toc-button${post.id}`} 
                        onClick={() => scrollToElement(newsPostId(post))}
                    >
                        <ListItemText>{postTitleWithDate(post)}</ListItemText>
                    </ListItemButton>
                ))}
            </List>
            
            {/* Posts */}
            <List>
                {posts.map(post => (
                    <div key={`news-post-div${post.id}`}>
                        <h2 id={newsPostId(post)}>
                            {postTitleWithDate(post)}
                        </h2>
                        <Markdown fileName={`news/${post.fileName}`} />
                        <Divider />
                    </div>
                ))}
            </List>
        </div>
    );
}
