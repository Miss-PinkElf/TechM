import React, { useEffect, useState } from "react"
import { Article, AuthorRank } from "../../../store/types";
import { Avatar, List, Typography } from "antd";
import { getAllArticleOverviewAPI, getAuthorRank } from "../../../utils/request";
import './index.css'
const tabsRank = ['博主榜', 'CommentRank', '收藏榜']
type renderProp = { item: any, index: number, orderKey: string }

const getRankClassName = (index: number): string => {
  return index < 3 ? `rank rank-${index}` : `rank`
}
const AuthorRankTemplate: React.FC<{ item: AuthorRank, index: number, orderKey: string }> = ({ item, index, orderKey }) => {
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
          avatar={<Avatar src={item.avatarUrl} size="large" style={{ top: '9px' }} />}
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
const ArticleRankTemplate: React.FC<{ item: Article, index: number, orderKey: string }> = ({ item, index, orderKey }) => {
  return (
    <List.Item
      key='id'
      extra={
        <div style={{ textAlign: 'right', color: 'red' }}>
          🔥{item.detailInfo.bookmarks}
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
  const [currentDataSource, setCurrentDataSource] = useState<(Article | AuthorRank)[]>([]);

  const getArticleRankByCommentList = async (): Promise<Article[]> => {
    console.log('-----orderByComment--------');
    const res_articles = (await getAllArticleOverviewAPI()).data
    return res_articles;
  }
  const getArticleRankByMarkList = async (): Promise<Article[]> => {
    console.log('-----orderByMark--------');
    const res_articles = (await getAllArticleOverviewAPI()).data
    console.log('--ByMark--', res_articles);
    return res_articles;
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
    setCurrentDataSource([]);//防止数据跟不上 终端程序运行*********太秒了
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
        return <AuthorRankTemplate item={item as AuthorRank} index={index} orderKey="1" />;
      case 1:
        return <ArticleRankTemplate item={item as Article} index={index} orderKey="comment" />;
      case 2:
        return <ArticleRankTemplate item={item as Article} index={index} orderKey="bookmark" />;
      default:
        return null;
    }
  }
  return (
    <div>
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
      <List
        dataSource={currentDataSource}
        rowKey='id'
        itemLayout="vertical"
        renderItem={(item, index) => {
          return (tabRankOrderMap.get(activeTab)!({ item: item, index: index, orderKey: '' }))
        }}
      />
    </div >
  )
}

export default ArticleRankList