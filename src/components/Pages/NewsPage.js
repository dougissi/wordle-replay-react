import Page from './Page';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Markdown from '../Markdown';
import dayjs from 'dayjs';

function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function NewsPage() {
    const posts = [
        {
            id: 1,
            date: "2024-05-31",
            title: "NYT Launches Wordle Archive",
            fileName: "2024-05-31_nyt_wordlearchive.md"
        }
    ];

    const newsPostId = (post) => `news-post${post.id}`;
    const postTitleWithDate = (post) => `${post.title} — ${dayjs(post.date).format('LL')}`;

    const NewsContent = () => (
        <>
            {/* TOC, if more than one post */}
            {posts.length > 1 &&
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
            }
            
            {/* Posts */}
            <List>
                {posts.map((post, i) => (
                    <div key={`news-post-div${post.id}`}>
                        <h2 id={newsPostId(post)}>
                            {postTitleWithDate(post)}
                        </h2>
                        <Markdown fileName={`news/${post.fileName}`} />
                        
                        {/* add divider if not last post */}
                        { (i < posts.length - 1) && <Divider /> }
                    </div>
                ))}
            </List>
        </>
    )

    return (
        <Page
            title="News"
            content={<NewsContent />}
        />
    );
}