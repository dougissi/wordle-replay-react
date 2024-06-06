import { useEffect } from 'react';
import Page from './Page';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Markdown from '../Markdown';
import dayjs from 'dayjs';
import { Badge } from '@mui/material';
import { lsKeys, maxNewsPostId, newsPosts }  from '../../constants';

function scrollToElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

export default function NewsPage({ 
    maxSeenNewsPostId,
    setMaxSeenNewsPostId,
    showNewsBadge,
    setShowNewsBadge,
}) {
    const newsPostHTMLId = (post) => `news-post${post.id}`;
    const postTitleWithDate = (post) => `${post.title} — ${dayjs(post.date).format('LL')}`;

    // remove news badge after timeout
    useEffect(() => {
        if (showNewsBadge) {
            setTimeout(() => {
                setShowNewsBadge(false);
                setMaxSeenNewsPostId(maxNewsPostId);
                localStorage.setItem(lsKeys.maxSeenNewsPostId, maxNewsPostId);
            }, 3000);
        }
    }, [showNewsBadge, setShowNewsBadge, setMaxSeenNewsPostId])

    const NewsContent = () => (
        <>
            {/* TOC */}
            {newsPosts.length > 1 &&
                <List
                    sx={{ listStyleType: 'disc', pl: 4 }}
                >
                    {newsPosts.map(post => (
                        <ListItemButton 
                            key={`news-post-toc-button${post.id}`} 
                            onClick={() => scrollToElement(newsPostHTMLId(post))}
                            sx={{ display: 'list-item' }}
                        >
                            <ListItemText>
                                <Badge
                                    color="secondary"
                                    variant="dot"
                                    badgeContent={Number(post.id > maxSeenNewsPostId)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    {postTitleWithDate(post)}
                                </Badge>
                            </ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            }
            
            
            {/* Posts */}
            <List>
                {newsPosts.map((post, i) => (
                    <div key={`news-post-div${post.id}`}>
                        <h2
                            id={newsPostHTMLId(post)}
                            className='Markdown'
                            style={{ textAlign: 'center' }}
                        >
                            {postTitleWithDate(post)}
                        </h2>
                        <Markdown fileName={`news/${post.fileName}`} />
                        
                        {/* add divider if not last post */}
                        { (i < newsPosts.length - 1) && <Divider style={{ paddingTop: '20px' }} /> }
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
