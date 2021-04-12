import { List, ListItem } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getAllArticles } from '../../redux/slices/articles';
import ArticleTile from './tile';

const ArticlesDisplay = () => {
  const articles = useSelector(getAllArticles);
  return (
    <List container component="ul">
      {articles.map((article) => (
        <ListItem items xs={12} component="li">
          <ArticleTile article={article} />
        </ListItem>
      ))}
    </List>
  );
};

export default ArticlesDisplay;
