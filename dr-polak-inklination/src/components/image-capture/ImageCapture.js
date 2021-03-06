import React from 'react';
import WebCam from 'react-webcam';


// import TearDrop from '../teardrop/Teardrop';
import Graphics from '../graphics/Graphics';
import './ImageCapture.css';

class ImageCapture extends React.Component {

    constructor(props) {
        super(props);
        this.cameraSize = '100%';
        this.state = {
          screenshot: null,
          showRetakeButton: false,
          showPhoto: true,
          showCaptureButton: true,
          showKeepImageButton: false,
          showClearImageButton: false,
          invertedClassName: '',
          areColorsInverted: false,
          showWebcam: true,
          add2DCanvas: false,
          showInvertButton: false,
          showRestartButton: false,
        };
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    capturePhoto() {
        const screenshot = this.webcam.getScreenshot();
        this.setState({ 
            screenshot,
            showRetakeButton: true,
            showPhoto: true,
            showCaptureButton: false,
            showKeepImageButton: true,
            showClearImageButton: false,
            showWebcam: false,
            invertedClassName: '',
            areColorsInverted: false,
            showInvertButton: true,
        });
    }

    retakePhoto() {
        this.setState({
            showPhoto: false,
            showWebcam: true,
            showCaptureButton: true,
            showRetakeButton: false,
            showKeepImageButton: false,
            showClearImageButton: false,
            showInvertButton: false,
        });
    }

    invertColors() {
        const areInverted = this.state.areColorsInverted;
        if (areInverted) {
            this.setState({ 
                invertedClassName: '',
                areColorsInverted: false,
            });
        } else {
            this.setState({ 
                invertedClassName: 'inverted',
                areColorsInverted: true,
            });
        }
    }

    keepImage() {
        this.setState({
            showWebcam: false,
            add2DCanvas: true,
            showKeepImageButton: false,
            showRetakeButton: false,
            showRestartButton: true,
        });

    }

    clearImage() {
        this.setState({
            showRetakeButton: false,
            showPhoto: false,
            showCaptureButton: true,
            showKeepImageButton: false,
            showClearImageButton: false,
            showWebcam: true,
            add2DCanvas: false,
        });
    }

    reStart() {
        window.location.reload();
    }

    render() {
        const captureButton = () => {
            //  TODO: add timeout.
            return <button onClick={this.capturePhoto.bind(this)}>Take photo</button>;
        };
        const retakeButton = <button onClick={this.retakePhoto.bind(this)}>Retake Photo</button>;
        const reStartButton = <button onClick={this.reStart.bind(this)}>Re start</button>;
        const invertColorsButton = <button onClick={this.invertColors.bind(this)}>Invert colors</button>;
        const clearButton = <button onClick={this.clearImage.bind(this)}>Clear image</button>;
        const keepImageButton = <button onClick={this.keepImage.bind(this)}>Ok, keep this one</button>;
        const image = <img className={this.state.invertedClassName} src={this.state.screenshot} alt='pelvis' />;
        const webCam = <WebCam 
            audio ={false}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={this.cameraSize}
            height={this.state.cameraSize}
        />;
        return <div id="image-capture">
            <div className="buttons">
                {this.state.showWebcam ? webCam : null}
                {this.state.showCaptureButton ? captureButton() : null}
                {this.state.showRetakeButton ? retakeButton : null}
                {this.state.showInvertButton ? invertColorsButton : null}
                {this.state.showKeepImageButton ? keepImageButton : null}
                {this.state.showClearImageButton ? clearButton : null}
                {this.state.showRestartButton ? reStartButton : null}
            </div>
            <div className="photo" ref={(photo) => { this.photo = photo; }}>
                {this.state.screenshot && this.state.showPhoto ? image : null}
            </div>
            <div id="graphics-container">
                    {this.state.add2DCanvas ? <Graphics /> : null}
            </div>
        </div>
  }
}

export default ImageCapture;