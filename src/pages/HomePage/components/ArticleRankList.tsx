import React, { useEffect, useState } from "react"
import { Article, AuthorRank } from "../../../store/types";
import { Avatar, Divider, List, Skeleton, Typography } from "antd";
import { getAllArticleOverviewAPI, getAuthorRank } from "../../../utils/request";
import './index.css'
import InfiniteScroll from "react-infinite-scroll-component";
const tabsRank = ['博主榜', '评价榜', '收藏榜']
type renderProp = { item: any, index: number, orderKey: number }

const getRankClassName = (index: number): string => {
  return index < 3 ? `rank rank-${index}` : `rank`
}

const AuthorRankTemplate: React.FC<{ item: AuthorRank, index: number, orderKey: number }> = ({ item, index, orderKey }) => {
  return (
    <List.Item
      key='id'
      extra={
        <div style={{ textAlign: 'right', color: 'red' }}>
          🔥 {item.popular}
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={getRankClassName(index)}>{index + 1}</div>
        <List.Item.Meta
          avatar={<Avatar src={item.avatarUrl} size="large" style={{ top: '9px' }} alt={item.name}
          />}
          title={

            <a href={`/author/${item.id}`} style={{ paddingTop: '10px' }}>
              {item.name}
            </a>

          }
          description={
            <Typography.Text type="secondary">
              粉丝数: {item.followerNum}
            </Typography.Text>
          }
        >
        </List.Item.Meta>
      </div>
    </List.Item >
  )
}
const ArticleRankTemplate: React.FC<{ item: Article, index: number, orderKey: number }> = ({ item, index, orderKey }) => {
  return (
    <List.Item
      key='id'
      extra={
        <div style={{ textAlign: 'right', color: 'red' }}>
          🔥{orderKey === 1 ? item.detailInfo.commentNum : item.detailInfo.bookmarks}
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={getRankClassName(index)}>{index + 1}</div>
        <List.Item.Meta
          avatar={<Avatar src={item.imageUrl} size="large" style={{ top: '9px' }} />}
          title={
            <a href={`/article/${item.id}`} style={{ paddingTop: '10px' }}>
              {item.title}
            </a>
          }
          description={
            <Typography.Text type="secondary">
              { }
            </Typography.Text>
          }
        >
        </List.Item.Meta>
      </div>
    </List.Item >
  )
}
const tabRankOrderMap = new Map<number, React.FC<renderProp>>([[0, AuthorRankTemplate], [1, ArticleRankTemplate], [2, ArticleRankTemplate]]);


//数据不同步 异步更新的
const ArticleRankList: React.FC = () => {

  const [tabRankIndex, setTabRankIndex] = useState(1)
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [authorList, setAuthorList] = useState<AuthorRank[]>([])
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentDataSource, setCurrentDataSource] = useState<(Article | AuthorRank)[]>([]);

  const getArticleRankByCommentList = async (): Promise<Article[]> => {
    console.log('-----orderByComment--------');
    const res_articles: Article[] = (await getAllArticleOverviewAPI(1, 7)).data
    return res_articles.sort((a, b) => b.detailInfo.commentNum - a.detailInfo.commentNum);
  }
  const getArticleRankByMarkList = async (): Promise<Article[]> => {
    console.log('-----orderByMark--------');
    const res_articles: Article[] = (await getAllArticleOverviewAPI(1, 7)).data
    console.log('--ByMark--', res_articles);
    return res_articles.sort((a, b) => b.detailInfo.bookmarks! - a.detailInfo.bookmarks!);
  }
  const getAuthorRankList = async (): Promise<AuthorRank[]> => {
    const res_authors = (await getAuthorRank()).data
    return res_authors;
  }
  const tabGetDataSourceMap = new Map<number, () => Promise<(Article | AuthorRank)[]>>([
    [0, getAuthorRankList],
    [1, getArticleRankByCommentList],
    [2, getArticleRankByMarkList]
  ]);
  useEffect(() => {
    const getDataFun = async () => {
      const data = await tabGetDataSourceMap.get(activeTab)!();
      setCurrentDataSource(data);
    }
    getDataFun();

  }, [])
  const handleChangeTab = (index: number) => {
    setActiveTab(index);
    setCurrentDataSource([]);//防止数据跟不上 终端程序运行
    console.log('----current-----', index);
  }
  useEffect(() => {
    const getDataFun = async () => {
      const data = await tabGetDataSourceMap.get(activeTab)!();
      setCurrentDataSource(data);
    }
    getDataFun();
  }, [activeTab])

  const renderListItem = (item: any, index: number) => {
    switch (activeTab) {
      case 0:
        return <AuthorRankTemplate item={item as AuthorRank} index={index} orderKey={0} />;
      case 1:
        return <ArticleRankTemplate item={item as Article} index={index} orderKey={1} />;
      case 2:
        return <ArticleRankTemplate item={item as Article} index={index} orderKey={2} />;
      default:
        return null;
    }
  }
  return (
    <div style={{ height: '400px' }}>
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '12px' }}>
        {tabsRank.map((tabName, index) => (
          <span
            key={index}
            onClick={() => { handleChangeTab(index) }}
            style={{
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === index ? 'bold' : 'normal',
              color: activeTab === index ? '#1890ff' : '#000',
              padding: '0 4px 8px 4px',
              borderBottom: activeTab === index ? '2px solid #1890ff' : 'none',
              transition: 'color 0.3s, border-bottom 0.3s',
            }}
          >
            {tabName}
          </span>
        ))}
      </div>
      <InfiniteScroll
        dataLength={currentDataSource.length}
        hasMore={currentDataSource.length > 30}//
        next={() => {

        }}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        height={850}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      >
        <List
          dataSource={currentDataSource}
          rowKey='id'
          itemLayout="vertical"
          renderItem={(item, index) => {
            return (tabRankOrderMap.get(activeTab)!({ item: item, index: index, orderKey: activeTab }))
          }}
        />
      </InfiniteScroll>

    </div >
  )
}

export default ArticleRankList