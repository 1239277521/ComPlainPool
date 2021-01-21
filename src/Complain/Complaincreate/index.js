//react
import React,{useContext,useState} from 'react'
import {SessionContext} from 'funweb-lib';
import {Redirect} from 'react-router-dom'
import {Link} from 'react-router-dom'
//antd
import {Layout, Input, Row, Col,Button, Form,message,Breadcrumb,Upload} from 'antd';
//css
import indexCss from './css/index.css'
//components
import RichText from './components/richText'
//mutations
import createBase from './mutations/createBase'
import updateBase from './mutations/updateBase'
import UploadPackage from "./mutations/UploadPackage";
//graphql
import {QueryRenderer, graphql} from 'react-relay';
const mutation=graphql`
mutation Complaincreate_Mutation($content: String!, $title: String!, $annex: [complainFileInput]) {
    createComplainPool(content: $content, title: $title, annex: $annex) {
      content
      createdAt
      deletedAt
      title
      updatedAt
      userId
      id
      annex {
        name
        url
      }
    }
  }
  
  
  `
  const {Content} = Layout;
//页面
export default function Page(props) {
    const formCol_labelCol=props.formCol_labelCol//表单Col中标签样式
    const formCol_wrapperCol=props.formCol_wrapperCol//表单Col中内容样式
    const col_span=props.col_span//col样式
    const complainId=props.id;
    const session=useContext(SessionContext)//session
    const [isPublish,setisPublish]=useState(false)//是否发布成功
    const id=props.id//吐槽池d
    const uploadprops = {
        name: 'file',
        beforeUpload(file, fileList) {
        },
        customRequest({
                          action,
                          data,
                          file,
                          filename,
                          headers,
                          onError,
                          onProgress,
                          onSuccess,
                          withCredentials,
                      }) {
            const inputs = {[filename]: null}
            const uploadables = {[filename]: file}
            UploadPackage.commit(
                session.environment,
                inputs,
                uploadables,
                (response, errors) => {
                    if (errors) {
                        onError(errors, response);
                    } else {
                        onSuccess(response);
                    }
                },
                onError
            )
            return false;
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {

            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 附件上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 附件上传失败`);
            }
        },
    };
    //富文本--不能为空
    function richTextCheck(rule, value) {
    
        //去标签
        let regex = /(<([^>]+)>)/ig
        let noHtmlVal=value.toString('html').replace(regex, '')
        
        let flag=false;//默认不通过

        if(noHtmlVal===''){
            return Promise.reject('请输入具体的内容');
        }
        else{
            //判断是否全是空格
            let tmpArr=noHtmlVal.split(';')
            for(let i=0;i<tmpArr.length;i++){
                if(tmpArr[i]!==' &nbsp'&&i!==tmpArr.length-1&&tmpArr[i]!=='&nbsp'){
                    flag=true
                }
                if(i===tmpArr.length-1&&flag===false){
                    tmpArr[tmpArr.length-1]===''?flag=false:flag=true
                }
            }

        }
        if(flag)
            return Promise.resolve();
        else
            return Promise.reject('请输入具体的内容');

    }
    //表单提交
    const onFinish = (formInfo) => {
        console.log(formInfo)
        //附件格式化
        if(formInfo.annex){
            formInfo.annex=formInfo.annex.map(val=>{
                if(val.response)
                    return{
                        url:val.url,
                        name:val.name
                    }
                else
                    return{
                        url:val.url,
                        name:val.name
                    }
            })
        }
        else {
            formInfo.annex=[]
        }
        
        if(id){
            //更新吐槽池
            updateBase(id,formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {
                        message.success({
                            content: '更新成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
        else {
            //发布吐槽池
            createBase(formInfo, session.environment, (response, errors) => {
                    if (errors) {
                        message.error(errors[0].message);
                    } else {

                        message.success({
                            content: '发布成功', duration: '1', onClose: () => {
                                setisPublish(true)
                            }
                        });
                    }
                },
                (errors) => {
                    message.error(errors.source.errors[0].message);
                })
        }
    }
    //发布成功
    if(isPublish)
        return(
            <Redirect to={'/complain.Complain/List'}/>
        )
    //暂未发布
    return (
        <>
            <Form
                className='form'
                name="form_content"
                initialValues={{remember: true}}
                onFinish={onFinish}
                labelAlign={'center'}
                wrapperCol={{span: 24}}
            >
                <Layout>
                <div className={indexCss.d}>
                    <Breadcrumb  className={indexCss.head_bread} separator="">
                    <Breadcrumb.Item>
                    <Link to="/complain.Complain/List" className="watchkeerper_headgzt"><b>吐槽池列表</b></Link>
                    <Breadcrumb.Separator />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                    <Link to="/complain.Complain/Create" className="watchkeerper_headgzt"><b>吐槽池创建</b></Link>
                    <Breadcrumb.Separator />
                    </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                </Layout>
                    <Content className={indexCss.richText}>
                    <div className={indexCss.contentArea}>
                        <Row className={indexCss.text}>
                            <Col>
                                <Form.Item
                                    label="标题"
                                    name="title"
                                    wrapperCol={{span:4,offset:4}}
                                    labelCol={{span:formCol_labelCol}}
                                    rules={[
                                        {required: true, message: '请输入标题'}]}
                                >
                                    <Input className={indexCss.input} placeholder='输入标题'/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row className={indexCss.text1}>
                            <Col>
                                <Form.Item
                                    label="吐槽池内容"
                                    name="content"
                                    wrapperCol={{span:10,offset:3}}
                                    rules={[{required: true, message: '请输入吐槽池内容'}]}
                                >
                                    <RichText onChange={(e) => {}} placeholer={'请输入吐槽池内容'}/>
                                </Form.Item>
                            </Col>
                        </Row >
                        <div span={24}>
                            <Row className={indexCss.image}>
                                <Col span={18}>
                                <Form.Item
                                            label="上传附件"
                                            name="annex"
                                            valuePropName="file"
                                            rules={[{required:false}]}
                                            labelCol={{span: 0, offset: 0}}
                                            wrapperCol={{span: 0,offset:3}}
                                            getValueFromEvent={(e) => {
                                                return e && e.fileList && e.fileList.filter((value => value.status === 'done')).map(value => {
                                                    return {url: value.response.singleUpload.hash, name: value.originFileObj.name}
                                                })
                                            }}
                                        >
                                            <Upload {...uploadprops} >
                                                    <Button className={indexCss.bt1}>
                                                        上传附件
                                                    </Button>
                                            </Upload>
                                        </Form.Item>
                                </Col>
                                <Col span={8}>
                                
                                </Col>
                        </Row>
                        </div>
                        <Row>
                                <Col span={2} offset={6}>
                                    <Button className={indexCss.bt2} type="primary" htmlType="submit">
                                        发送
                                    </Button>
                                </Col>
                                <Col span={2} offset={4}>
                                    <Link to='/complain.Complain/List'>
                                        <Button className={indexCss.bt2}>
                                            返回
                                        </Button>
                                    </Link>
                                 </Col>
                        </Row>
                    </div>
                </Content>
            </Form>
        </>
    )
}

