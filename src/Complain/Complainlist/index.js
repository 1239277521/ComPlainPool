//react
import React, {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {SessionContext} from 'funweb-lib';
//antd
import {List, Row, Col,Breadcrumb,Layout,Tabs,Empty} from 'antd';
import {CommentOutlined} from '@ant-design/icons';
//css
import indexCss from './css/index.css'
//graphql
import {QueryRenderer, graphql} from 'react-relay';
//moment
import moment from 'moment'
//mutation
const { TabPane } = Tabs;
const query=graphql`
query Complainlist_Query($first: Int, $order: String, $skip: Int) {
    complainpool {
      complainPoolQueryList(first: $first, order: $order, skip: $skip) {
        edges {
          title
          id
          createdAt
          content
          user {
            name
            id
          }
          annex{
            name
            url
          }
          count
        }
      }
    }
    viewer {
      user {
        ... on Employee {
          id
        }
      }
    }
  }
  
  `
export default function () {
    //session
    const session = useContext(SessionContext);
    const [pageNum] = useState('1');//页码
    return (<QueryRenderer
        //环境设置
        environment={session.environment}
        //查询语句
        query={query}
        variables={{
            first:100,
            order:"",
            skip:(pageNum - 1) * 5
            
        }}
        //查询过程
        render={({error, props, retry}) => {
            if (error) {//error
                return (
                    <div>
                        <h1>Error!</h1><br/>{error.message}
                    </div>)
            }else{
                return (
                    <Page
                       {...props}
                        pageNum={pageNum}
                    />
                )
            }
            }
        }
    />);
}

function Page(props) {
    const session = useContext(SessionContext);
    let cmssData =[];
    if (props&&props.complainpool){
        cmssData = props.complainpool.complainPoolQueryList.edges;
    }
    let viewData =[];
    if (props&&props.viewer){
       
        viewData = props.viewer;
    }
    let myData =[];
    if(cmssData.length>0){
        cmssData.map(dis=>{
            console.log(dis);
            if(dis.user.id===session.user.id){
                myData.push(dis)
            }
        });
        cmssData.sort(function(a,b){
            return a.time < b.time ? 1 : -1
        });
        myData.sort(function(a,b){
            return a.time < b.time ? 1 : -1
        })
    }



    return (
        
        <>
                <Layout style={{backgroundColor:"white"}}>
                        <Breadcrumb  className={indexCss.head_bread} separator="" >
                        <Breadcrumb.Item>
                        <Link to="/complain.Complain/List" className="watchkeerper_headgzt"><b>吐槽池</b></Link>
                        <Breadcrumb.Separator />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                        <Link to="/complain.Complain/List" className="watchkeerper_headgzt"><b>吐槽池列表</b></Link>
                        <Breadcrumb.Separator />
                        </Breadcrumb.Item>
                        </Breadcrumb>
                </Layout>
                <div className={indexCss.ct}>
                    <Row>
                        <Col>
                        <span>创建吐槽池</span>
                        </Col>
                        <Col>
                        <a href="/complain.Complain/Create">
                            <div className={indexCss.orderReceive_head_addSpan}> 
                            </div>
                        </a>
                        </Col>
                    </Row>
                </div>
                <div style={{backgroundColor:"white"}}>
                    <Tabs defaultActiveKey="all_list" style={{backgroundColor:"white",marginLeft:"20px",marginRight:"20px"}} size="middle">
                        <TabPane tab={<span className={indexCss.tab}>全部文章</span>} key="all_list" >
                            <List
                                pagination={{
                                    responsive:false,
                                    onChange: page => {
                                        console.log(page);
                                    },
                                    pageSize: 10,
                                  }}
                                dataSource={cmssData}
                                renderItem={item => {
                                    return (
                                        <List.Item
                                        >
                                            <div className={indexCss.body}>
                                                <Row span={24}>
                                                    <Col id={indexCss.title}>
                                                        <Link to={{pathname: `/complain.Complain/Content/`,search: `?id=${item.id}`,}}>
                                                            <span style={{color:"#555555",fontWeight:"bold"}}>{item.title}</span>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                <Row span={24}>
                                                    <Col id={indexCss.name}>
                                                        <span>发布人：{item.user?item.user.name:''}</span>
                                                    </Col>
                                                    <Col id={indexCss.time}>
                                                        <span>发布时间：{moment(item.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                    </Col>
                                                    <Col>
                                                        <Link to={{pathname: `/complain.Complain/Content/`,search: `?id=${item.id}`,}}>
                                                        <div className={indexCss.image}>
                                                            <CommentOutlined/>
                                                            <span style={{marginLeft:"10px",color:"#black"}}>{item.count}</span>
                                                        </div>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                <Row span={24}>
                                                    <Col >
                                                        {
                                                            item.annex?item.annex.map((val)=>{
                                                                return(
                                                                    <a  onClick={()=>window.open( '/storage/' + val.url)}>{val.name}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                                                                    // <img id={indexCss.images} src={'/storage/' + image.url}/>
                                                                )
                                                            }):null
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                        </List.Item>

                                    )

                                }
                                }
                            />
                        </TabPane>

                        <TabPane tab={<span className={indexCss.tab}>我发布的文章</span>} key="other_list">
                            <List
                                pagination={{
                                    responsive:false,
                                    onChange: page => {
                                      console.log(page);
                                    },
                                    pageSize: 10,
                                  }}
                                dataSource={myData}
                                renderItem={item1 => {
                                        return (
                                            <List.Item>
                                                <div className={indexCss.body}>
                                                    <Row span={24}>
                                                        <Col id={indexCss.title}>
                                                            <Link to={{pathname: `/complain.Complain/Content/`,search: `?id=${item1.id}`,}}>
                                                                <span style={{color:"#555555",fontWeight:"bold"}}>{item1.title}</span>
                                                            </Link>
                                                        </Col>
                                                    </Row>
                                                    <Row span={24}>
                                                        <Col id={indexCss.name}>
                                                            <span>发布人：{item1.user?item1.user.name:''}</span>
                                                        </Col>
                                                        <Col id={indexCss.time}>
                                                            <span>发布时间：{moment(item1.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                        </Col>
                                                        <Col>
                                                            <Link to={{pathname: `/complain.Complain/Content/`,search: `?id=${item1.id}`,}}>
                                                                <div className={indexCss.image}>
                                                                <CommentOutlined/>
                                                                <span style={{marginLeft:"10px",color:"#black"}}>{item1.count}</span>
                                                                </div>

                                                            </Link>
                                                        </Col>
                                                    </Row>
                                                    <Row span={24}>
                                                        <Col >
                                                            {/*<div className={bacsicInfo_css.instruction_content}*/}
                                                                 {/*dangerouslySetInnerHTML= {{ __html:instruction.content.replace('<img src="../storage/','<img src="/storage/') }}/>*/}
                                                            {
                                                                item1.annex?item1.annex.map((val)=>{
                                                                    return(
                                                                        <a  onClick={()=>window.open( '/storage/' + val.url)}>{val.name}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                                                                    )
                                                                }):null
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </List.Item>
                                        )
                                    }
                                    //<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                            />
                        </TabPane>
                    </Tabs>
              </div>
        </>
    )
}

