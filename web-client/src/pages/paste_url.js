import React,{Component} from "react";
import axios from "axios";
import OpenSocket from "socket.io-client"
import {
    Container,
    Row,
    Button,
    Input,
    Form,
    Col,
    Progress
}from 'reactstrap';

const api_url="http://localhost:4000";
const socket=OpenSocket(api_url);

export default class PasteUrl extends Component{
    constructor(props){
        super(props);

        this.state={
            urlText:"",
            respData:"",
            percentage:"",
            dataToBeDownloaded:"",
            dataDownloaded:0,
            blobData:null,
            videoName:"",
            videoUploader:""
        };
    }

    handleSubmit=(e)=>{
        e.preventDefault();

        axios.post(api_url,{url:this.state.urlText},
                   {
                    responseType:"blob",
                    onDownloadProgress:(ProgressEvent)=>{
                        this.setState({dataDownloaded:ProgressEvent.loaded})
                    }
                   })
              .then((response)=>{
                const url=window.URL.createObjectURL(new Blob([response.data]))
                this.setState({blobData:url});
              })
              .catch((err)=>{
                console.log("url submit error",err)
              });
    }

    handleTextChange(e){
        this.setState({urlText:e.target.value})
    }

    componentDidMount(){
        socket.on("progressEventSocket",(data)=>{
            this.setState({percentage:data[0]});
        });

        socket.on("downloadCompletedServer",(data)=>{
            this.setState({dataToBeDownloaded:data[0]});
        });

        socket.on("videoDetails",(data)=>{
            this.setState({videoName:data[0]});
            this.setState({videoUploader:data[1]});
        });
        
    }
    render(){
        return(
            <Container>
                <h1>Paste Video URL</h1>
                <Form onSubmit={(e)=>{this.handleSubmit(e)}}>
                    <Row>
                        <Col>
                            <Input required type="text" placeholder="URL"
                                    value={this.state.urlText}
                                    onChange={(e)=>{this.handleTextChange(e)}}>

                            </Input>
                        </Col>
                    </Row>
                    <Row style={{textAlign:"center",marginTop:"10px"}}>
                        <Col>
                            <Button type="submit" color="primary" size="lg">
                                Start Process
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row>
                    <Col>
                        {this.state.videoName !==""
                            ?(
                                <div class="jumbotron" style={{marginTop:"10px"}}>
                                    <h1>Title:{this.state.videoName}</h1>
                                    <p>Uploaded by: {this.state.videoUploader}</p>
                                </div>
                            )
                            :("")

                        }
                    </Col>
                </Row>

                {/* server download progress */}
                <Row className="progressBarRow">
                    <Col xs="12">
                        <Progress 
                            animated={this.state.percentage===100?false:true}
                            value={this.state.percentage}
                        >
                            Warming up the router
                        </Progress>
                    </Col>
                </Row>
                
                {/* downloading I should know what!!! */}
                <Row className="progressBarRow">
                    <Col xs="12">
                        <Progress 
                            animated={(this.state.dataDownloaded*100)/
                                       this.state.dataToBeDownloaded===100
                                       ? false:true
                                    }
                            value={this.state.dataToBeDownloaded>0
                                   ?(this.state.dataDownloaded*100)/
                                   this.state.dataToBeDownloaded
                                   :0
                                }
                        >
                           Now  Hacking whaaaaaat?
                        </Progress>
                    </Col>
                </Row>

                <Row className="downloadButton">
                    <Col>
                        {this.state.blobData!==null
                            ?<div>
                                <p>almost done!</p>
                                <a href={this.state.blobData}
                                   download={this.state.videoName+".mp3"}
                                >
                                    <Button color="danger" size="lg">
                                        Download
                                    </Button>
                                </a>
                            </div>

                            :""
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}