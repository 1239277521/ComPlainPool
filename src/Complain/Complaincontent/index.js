//react
import React, {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
//antd
import {Row, Col, Form, Button, List, Input, Layout, Breadcrumb, message, Popover, Spin} from 'antd';
import {CommentOutlined} from '@ant-design/icons';
//css
import indexCss from './css/index.css'
//graphql
import createComplain from './mutations/createComplain'
import updateComplain from './mutations/updateComplain'
import {QueryRenderer, graphql} from 'react-relay';
import {ModalLink, SessionContext} from 'funweb-lib';
//moment
import moment from 'moment'
//mutation
const query = graphql`
query Complaincontent_Query($id: ID!, $complainId: ID!) {
  complainpool {
    complainPoolQuery(id: $id) {
      content
      count
      createdAt
      title
      comment {
        commentContent
        createdAt
        fId
        topicId
        id
        user {
          id
          name
        }
      }
      user {
        name
        id
      }
      id
      annex {
        name
        url
      }
    }
    commentQueryList(complainId: $complainId) {
      edges {
        commentContent
        fId
        topicId
        id
        createdAt
        user {
          name
          id
        }
      }
    }
  }
}




  `
const {Content} = Layout;
export default function Page(props) {
    const io = props.query.get('id')
    console.log(io)
    const session = useContext(SessionContext);
    const [pageNum, setPageNum] = useState('1');//页码
    return (
        <QueryRenderer
            //环境设置
            environment={session.environment}
            //查询语句
            query={query}
            variables={{
                id: io,
                complainId: io,

            }}
            //查询过程
            render={({error, props, retry}) => {

                if (error) {//error
                    return (
                        <div>
                            <h1>Error!</h1><br/>{error.message}
                        </div>)
                }
                if (props && props.complainpool) {
                    return (
                        < Detail
                            {...props}
                            retry={retry}
                        />
                    )
                }
                return (
                    <Spin tip={'加载中'}>
                        <div style={{marginTop: 400}}></div>
                    </Spin>
                )

            }
            }
        />);

}

function Detail(props) {
    //评论内容

    let commentData = []
    if (props && props.complainpool) {
        commentData = props.complainpool.commentQueryList.edges;
    }
    //父评论
    let cqlData = [];
    if (props && props.complainpool) {
        cqlData = props.complainpool.complainPoolQuery.comment;
    }

    let cmssData = [];
    if (props && props.complainpool) {
        cmssData = props.complainpool.complainPoolQuery;
    }
    const [topicId, setTopicId] = useState(cmssData.id);
    const [fId, setFId] = useState(cqlData.id);
    //评论提交
    const session = useContext(SessionContext)//session
    const clickto = (com, top) => {
        setFId(com)
        setTopicId(top)
        // console.log(com)
        // console.log(top)
        // cqlData.reverse(
        //   function(a,b){
        //   return a.time < b.time ? 1 : -1
        //   }
        //   )
    }
    // cqlData.reverse(
    //   function(a,b){
    //   return a.time < b.time ? 1 : -1
    //   }
    //   )
    const onFinish1 = (formInfo) => {
        formInfo.topicId = topicId
        formInfo.fId = fId
        if (id && topicId && fId) {
            //更新评论
            updateComplain(id, formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {

                        message.success({
                            content: '更新成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                        props.retry()
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
        else {
            //发布评论
            if (formInfo) {
                formInfo.topicId = topicId
                formInfo.fId = fId
            }
            // console.log(formInfo)
            createComplain(formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {

                        message.success({
                            content: '评论成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                        props.retry()
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
    }

    const content = (
        <div>
            <Form
                className={indexCss.form}
                name="form_content"
                initialValues={{remember: true}}
                onFinish={onFinish1}
            >
                <Row>
                    <Col style={{marginLeft: "32px"}}>
                        <Form.Item
                            name="commentContent"
                            rules={[{required: true, message: '评论不能为空'}]}
                        >
                            <Input id={indexCss.input1}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Item>
                            <Button id={indexCss.button1} type="primary" htmlType="submit">
                                评论
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
    const [isPublish, setisPublish] = useState(false)//是否发布成功
    const id = cmssData.id//吐槽池id
    const [isComment, setIsComment] = useState(false)//是否评论成功
    const topicId1 = cmssData.id
    const onFinish = (formInfo) => {
        formInfo.topicId = topicId1
        formInfo.fId = 0
        if (id && topicId && fId) {
            //更新评论
            updateComplain(id, formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {

                        message.success({
                            content: '更新成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                        props.retry()
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
        else {
            //发布评论
            if (formInfo) {
                formInfo.topicId = topicId1
                formInfo.fId = 0
            }
            createComplain(formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {
                        message.success({
                            content: '评论成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                        props.retry()
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
    }

    return (
        <>

            <Layout style={{backgroundColor: "white", margin: "0px 0px 20px 0px"}}>
                <Breadcrumb className={indexCss.head_bread} separator="">
                    <Breadcrumb.Item>
                        <Link to="/complain.Complain/List"><b>吐槽池列表</b></Link>
                        <Breadcrumb.Separator/>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/complain.Complain/Content"><b>吐槽池详情</b></Link>
                        <Breadcrumb.Separator/>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Layout>
            <div style={{color: "#555555"}}>
                <div className={indexCss.content}>
                    <Row>
                        <Col id={indexCss.title}>
                            <span>{cmssData.title}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col id={indexCss.name}>
                            <span>发布人：{cmssData.user && cmssData.user.name}</span>
                            <span
                                style={{paddingLeft: "20px"}}>{moment(props.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col id={indexCss.text}>
                            <div dangerouslySetInnerHTML={{__html: cmssData.content}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginLeft:"40px"}}>
                            {
                                cmssData.annex?cmssData.annex.map((val) => {
                                    return (
                                        <a onClick={() => window.open('/storage/' + val.url)}>{val.name}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                                    )
                                }):null

                            }

                        </Col>
                    </Row>
                </div>

                <div className={indexCss.content}>
                    <Row>
                        <Col>
                            <Form
                                className={indexCss.form}
                                name="form_content"
                                initialValues={{remember: true}}
                                onFinish={onFinish}
                            >
                                <Row>
                                    <Col style={{marginLeft: "32px"}}>
                                        <Form.Item
                                            name="commentContent"
                                            rules={[{required: true, message: '评论不能为空'}]}
                                        >
                                            <Input id={indexCss.input}/>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item>
                                            <Button id={indexCss.button} type="primary" htmlType="submit">
                                                评论
                                            </Button>
                                        </Form.Item>

                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </div>

                <div className={indexCss.content}>
                    <List
                        // pagination={{
                        //     responsive: true,
                        //     onChange: page => {
                        //         console.log(page);
                        //     },
                        //     pageSize: 10,
                        // }}

                        dataSource={cqlData}
                        renderItem={item => {
                            return (
                                <List.Item
                                    id={indexCss.item}
                                >
                                    <div className={indexCss.comment}>
                                        <Row>
                                            <Col className={indexCss.commenter}>
                                                <span style={{fontWeight: "bold"}}>{item.user.name}:</span>
                                                <span>{item.commentContent}</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className={indexCss.commenttime}>
                                                <span>{moment(item.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                <span id={indexCss.link} style={{marginLeft: "620px"}}>
                                                        <Popover content={content} placement="bottomRight"
                                                                 trigger="click" onClick={() => {
                                                            clickto(item.id, item.topicId)
                                                        }}>
                                                          <CommentOutlined/>
                                                        <span style={{marginLeft: "10px"}}>回复</span>
                                                        </Popover>
                                                      </span>
                                            </Col>
                                        </Row>

                                        <Row className={indexCss.reply}>
                                            <List
                                                dataSource={commentData}
                                                renderItem={item1 => {
                                                    if (item1.fId === parseInt(item.id.split("-")[1])) {
                                                        return (
                                                            <List.Item
                                                                id={indexCss.item1}
                                                            >
                                                                <div className={indexCss.fcomment}>
                                                                    <Row>
                                                                        <Col className={indexCss.fcommenter}>
                                                                            <span
                                                                                style={{fontWeight: "bold"}}>{item1.user.name}:</span>
                                                                            <span>{item1.commentContent}</span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col className={indexCss.fcommenttime}>
                                                                            <span>{moment(item1.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                                            <span id={indexCss.flink}
                                                                                  style={{marginLeft: "580px"}}>
                                                                              <Popover content={content}
                                                                                       placement="bottomRight"
                                                                                       trigger="click" onClick={() => {
                                                                                  clickto(item1.id, item1.topicId)
                                                                              }}>
                                                                                <CommentOutlined/>
                                                                                <span
                                                                                    style={{marginLeft: "10px"}}>回复</span>
                                                                                </Popover>
                                                                              </span>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <List
                                                                            dataSource={commentData}
                                                                            renderItem={item2 => {
                                                                                if (item2.fId === parseInt(item1.id.split("-")[1])) {
                                                                                    return (
                                                                                        <List.Item
                                                                                            id={indexCss.item}
                                                                                        >
                                                                                            <div
                                                                                                className={indexCss.fcomment}>
                                                                                                <Row>
                                                                                                    <Col
                                                                                                        className={indexCss.fcommenter}>
                                                                                                        <span
                                                                                                            style={{fontWeight: "bold"}}>{item2.user.name}回复{item1.user.name}:</span>
                                                                                                        <span>{item2.commentContent}</span>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <Row>
                                                                                                    <Col
                                                                                                        className={indexCss.fcommenttime}>
                                                                                                        <span>{moment(item2.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                                                                        <span
                                                                                                            id={indexCss.flink}
                                                                                                            style={{marginLeft: "580px"}}>
                                                                                                  <Popover
                                                                                                      content={content}
                                                                                                      placement="bottomRight"
                                                                                                      trigger="click"
                                                                                                      onClick={() => {
                                                                                                          clickto(item2.id, item2.topicId)
                                                                                                      }}>
                                                                                                    <CommentOutlined/>
                                                                                                    <span
                                                                                                        style={{marginLeft: "10px"}}>回复</span>
                                                                                                    </Popover>
                                                                                                  </span>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                <Row>
                                                                                                    <Row>
                                                                                                        <List
                                                                                                            dataSource={commentData}
                                                                                                            renderItem={item3 => {
                                                                                                                if (item3.fId === parseInt(item2.id.split("-")[1])) {
                                                                                                                    return (
                                                                                                                        <List.Item
                                                                                                                            id={indexCss.item}
                                                                                                                        >
                                                                                                                            <div
                                                                                                                                className={indexCss.fcomment}>
                                                                                                                                <Row>
                                                                                                                                    <Col
                                                                                                                                        className={indexCss.fcommenter}>
                                                                                                                                        <span
                                                                                                                                            style={{fontWeight: "bold"}}>{item3.user.name}回复{item2.user.name}:</span>
                                                                                                                                        <span>{item3.commentContent}</span>
                                                                                                                                    </Col>
                                                                                                                                </Row>
                                                                                                                                <Row>
                                                                                                                                    <Col
                                                                                                                                        className={indexCss.fcommenttime}>
                                                                                                                                        <span>{moment(item3.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                                                                                                        <span
                                                                                                                                            id={indexCss.flink}
                                                                                                                                            style={{marginLeft: "580px"}}>
                                                                                                                        <Popover
                                                                                                                            content={content}
                                                                                                                            placement="bottomRight"
                                                                                                                            trigger="click"
                                                                                                                            onClick={() => {
                                                                                                                                clickto(item3.id, item3.topicId)
                                                                                                                            }}>
                                                                                                                          <CommentOutlined/>
                                                                                                                          <span
                                                                                                                              style={{marginLeft: "10px"}}>回复</span>
                                                                                                                          </Popover>
                                                                                                                        </span>
                                                                                                                                    </Col>
                                                                                                                                </Row>
                                                                                                                                <Row>
                                                                                                                                    <Row>
                                                                                                                                        <List
                                                                                                                                            dataSource={commentData}
                                                                                                                                            renderItem={item4 => {
                                                                                                                                                if (item4.fId === parseInt(item3.id.split("-")[1])) {
                                                                                                                                                    return (
                                                                                                                                                        <List.Item
                                                                                                                                                            id={indexCss.item}
                                                                                                                                                        >
                                                                                                                                                            <div
                                                                                                                                                                className={indexCss.fcomment}>
                                                                                                                                                                <Row>
                                                                                                                                                                    <Col
                                                                                                                                                                        className={indexCss.fcommenter}>
                                                                                                                                                                        <span
                                                                                                                                                                            style={{fontWeight: "bold"}}>{item4.user.name}回复{item3.user.name}:</span>
                                                                                                                                                                        <span>{item4.commentContent}</span>
                                                                                                                                                                    </Col>
                                                                                                                                                                </Row>
                                                                                                                                                                <Row>
                                                                                                                                                                    <Col
                                                                                                                                                                        className={indexCss.fcommenttime}>
                                                                                                                                                                        <span>{moment(item4.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                                                                                                                                        <span
                                                                                                                                                                            id={indexCss.flink}
                                                                                                                                                                            style={{marginLeft: "580px"}}>
                                                                                                                                                                            <Popover
                                                                                                                                                                                content={content}
                                                                                                                                                                                placement="bottomRight"
                                                                                                                                                                                trigger="click"
                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                    clickto(item4.id, item4.topicId)
                                                                                                                                                                                }}>
                                                                                                                                                                              <CommentOutlined/>
                                                                                                                                                                              <span
                                                                                                                                                                                  style={{marginLeft: "10px"}}>回复</span>
                                                                                                                                                                              </Popover>
                                                                                                                                                                            </span>
                                                                                                                                                                    </Col>
                                                                                                                                                                </Row>
                                                                                                                                                                <Row>
                                                                                                                                                                    <Row>
                                                                                                                                                                        <List
                                                                                                                                                                            dataSource={commentData}
                                                                                                                                                                            renderItem={item5 => {
                                                                                                                                                                                if (item5.fId === parseInt(item4.id.split("-")[1])) {
                                                                                                                                                                                    return (
                                                                                                                                                                                        <List.Item
                                                                                                                                                                                            id={indexCss.item}
                                                                                                                                                                                        >
                                                                                                                                                                                            <div
                                                                                                                                                                                                className={indexCss.fcomment}>
                                                                                                                                                                                                <Row>
                                                                                                                                                                                                    <Col
                                                                                                                                                                                                        className={indexCss.fcommenter}>
                                                                                                                                                                                                        <span
                                                                                                                                                                                                            style={{fontWeight: "bold"}}>{item5.user.name}回复{item4.user.name}:</span>
                                                                                                                                                                                                        <span>{item5.commentContent}</span>
                                                                                                                                                                                                    </Col>
                                                                                                                                                                                                </Row>
                                                                                                                                                                                                <Row>
                                                                                                                                                                                                    <Col
                                                                                                                                                                                                        className={indexCss.fcommenttime}>
                                                                                                                                                                                                        <span>{moment(item5.createdAt).utc().add(8, 'hours').format('YYYY-MM-DD HH:mm')}</span>
                                                                                                                                                                                                        <span
                                                                                                                                                                                                            id={indexCss.flink}
                                                                                                                                                                                                            style={{marginLeft: "580px"}}>
                                                                                                                                                                                                            <Popover
                                                                                                                                                                                                                content={content}
                                                                                                                                                                                                                placement="bottomRight"
                                                                                                                                                                                                                trigger="click"
                                                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                                                    clickto(item5.id, item5.topicId)
                                                                                                                                                                                                                }}>
                                                                                                                                                                                                              <CommentOutlined/>
                                                                                                                                                                                                              <span
                                                                                                                                                                                                                  style={{marginLeft: "10px"}}>回复</span>
                                                                                                                                                                                                              </Popover>
                                                                                                                                                                                                            </span>
                                                                                                                                                                                                    </Col>
                                                                                                                                                                                                </Row>
                                                                                                                                                                                            </div>
                                                                                                                                                                                        </List.Item>
                                                                                                                                                                                    )
                                                                                                                                                                                }
                                                                                                                                                                            }}
                                                                                                                                                                        />
                                                                                                                                                                    </Row>
                                                                                                                                                                </Row>
                                                                                                                                                            </div>
                                                                                                                                                        </List.Item>
                                                                                                                                                    )
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                        />
                                                                                                                                    </Row>
                                                                                                                                </Row>
                                                                                                                            </div>
                                                                                                                        </List.Item>
                                                                                                                    )
                                                                                                                }
                                                                                                            }}
                                                                                                        />
                                                                                                    </Row>
                                                                                                </Row>
                                                                                            </div>
                                                                                        </List.Item>
                                                                                    )
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Row>
                                                                </div>
                                                            </List.Item>
                                                        )
                                                    }
                                                }}
                                            />
                                        </Row>
                                    </div>

                                </List.Item>
                            )
                        }}
                    />
                </div>
                <Row style={{margin: "-50px 0px 0px 20px"}}>
                    <Link to='/complain.Complain/List'>
                        <Button id={indexCss.button} type="primary">
                            返回
                        </Button>
                    </Link>
                </Row>

            </div>
        </>

    )

}