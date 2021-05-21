import {withRouter} from 'react-router-dom';
import {useDispatch} from 'react-redux'
import './DiagnosisPage.css'
import axios from 'axios'
import S3 from "react-aws-s3"
import {uploadFile} from "react-s3";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import {Radio} from 'antd';
import "./DiagnosisPage.css"
import bgspring from "../../background/spring.png";
import bgsummer from "../../background/summer.png";
import bgFall from "../../background/fall.png"
import bgWinter from "../../background/winter.png"
import DrapeComponent from "../../components/DrapeComponent";
import ResultComponent from "../../components/ResultComponent";

const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY
}

function DiagnosisPage(props) {
    const [season, setBg] = useState(bgspring);
    const [image, setImg] = useState(null);
    const onSpring = () => {
        setBg(bgspring);
    }

    const onSummer = () => {
        setBg(bgsummer);
    }
    const onFall = () => {
        setBg(bgFall);
    }
    const onWinter = () => {
        setBg(bgWinter);
    }
    const onUpload = (e) => {
        e.preventDefault(); // 화면 새로고침 x
        var file = e.target.files[0]
        var data = {
            'file': file,
            'name': file.name
        }
        uploadFile(file, config)
            .then(data => console.log(data))
            .catch(err => console.log(err))

        axios.post('/api/user/face', data)
            .then(response => {
                console.log(response)
                setImg(response.data.Location)
                console.log('test', response.data)
                // if (response.data.success) {

                // } else {
                //     console.log('error')
                // }
            })
    }
    const [inputs, setInputs] = useState({
        spring: '',
        summer: '',
        fall: '',
        winter: ''
    })

    const {spring, summer, fall, winter} = inputs

    const onChange = (e) => {
        const {name, value} = e.target

        // 변수를 만들어 이벤트가 발생했을때의 value를 넣어줬다
        const nextInputs = {
            //스프레드 문법으로 기존의 객체를 복사한다.
            ...inputs,
            [name]: value,
        }
        //만든 변수를 seInput으로 변경해준다.
        setInputs(nextInputs)
    }

    const [result, setResult] = useState(null);
    const checkResult = () => {
        var data = ['', '', '', '']
        data[spring - 1] = 'spring'
        data[summer - 1] = 'summer'
        data[fall - 1] = 'fall'
        data[winter - 1] = 'winter'
        console.log(data)

        axios.post('/api/user/result', data)
            .then(response => {
                console.log(response.data)
                setResult(response.data)
            })
    }

    if (!image) {
        return (
            <>
                <Header/>

                <div className="App">
                    <div className="box">
                        <div className="image-input">
                            <div>퍼스널 컬러 진단하기</div>
                            <input type="file" name="image" onChange={onUpload}/>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </>
        )
    } else if (!result) {
        return (

            <>
                <Header/>

                <div className="App">
                    <div className="main-container">
                        <div className="diagnosis">
                            <DrapeComponent bgSeason={season} detectedFace={image}></DrapeComponent>

                            {/*<ToggleButtonGroup className="diagnosis" type="radio" name="options" defaultValue={1}>*/}
                            {/*    <ToggleButton onClick={onSpring} value={1} variant="outline-secondary" > 1 </ToggleButton>*/}
                            {/*    <ToggleButton onClick={onSummer}value={2} variant="outline-secondary"> 2 </ToggleButton>*/}
                            {/*    <ToggleButton onClick={onFall} value={3} variant="outline-secondary"> 3 </ToggleButton>*/}
                            {/*    <ToggleButton onClick={onWinter} value={4} variant="outline-secondary"> 4 </ToggleButton>*/}
                            {/*</ToggleButtonGroup>*/}

                            {/*<ButtonToolbar className="diagnosis" aria-label="Toolbar with button groups">*/}
                            {/*    <ToggleButtonGroup className="mr-2" name="options">*/}
                            {/*        <ToggleButton  onClick={onSpring}  variant="outline-secondary" > 1 </ToggleButton>*/}
                            {/*    </ToggleButtonGroup>*/}
                            {/*    <ToggleButtonGroup className="mr-2" name="options">*/}
                            {/*        <ToggleButton onClick={onSummer} variant="outline-secondary"> 2 </ToggleButton>*/}
                            {/*    </ToggleButtonGroup>*/}
                            {/*    <ToggleButtonGroup className="mr-2" name="options">*/}
                            {/*        <ToggleButton onClick={onFall} variant="outline-secondary"> 3 </ToggleButton>*/}
                            {/*    </ToggleButtonGroup>*/}
                            {/*    <ToggleButtonGroup name="options">*/}
                            {/*        <ToggleButton onClick={onWinter} variant="outline-secondary"> 4 </ToggleButton>*/}
                            {/*    </ToggleButtonGroup>*/}
                            {/*</ButtonToolbar>*/}

                            <Radio.Group className="diagnosis" defaultValue="spring" buttonStyle="solid" size="large">
                                <Radio.Button onClick={onSpring} value="spring">1</Radio.Button>
                                <Radio.Button onClick={onSummer} value="summer">2</Radio.Button>
                                <Radio.Button onClick={onFall} value="fall">3</Radio.Button>
                                <Radio.Button onClick={onWinter} value="winter">4</Radio.Button>
                            </Radio.Group>
                            <div className="rank">
                                <input name="spring" value={spring} onChange={onChange}/>
                                <input name="summer" value={summer} onChange={onChange}/>
                                <input name="fall" value={fall} onChange={onChange}/>
                                <input name="winter" value={winter} onChange={onChange}/>
                            </div>
                            <div className="notice">숫자로 순위를 적어주세요</div>
                            <div onClick={checkResult}>
                                <div className="result-button">
                                    결과 확인
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    } else {
        return (
            <ResultComponent type={result.type} prob={result.prob} worst={result.worst}></ResultComponent>
        )
    }

}

export default withRouter(DiagnosisPage)
