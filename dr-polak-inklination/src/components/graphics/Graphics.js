import React from 'react';
import Konva from 'konva';


import './Graphics.css'

class Graphics extends React.Component {
    constructor(props) {
        super(props);
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.state = {
            stage: new Konva.Stage({
                container: 'graphics-container',
                width: width,
                height: 422,
            }),
            layer: new Konva.Layer(),
            maxTeardrops: 0,
            drop1Position: {},
            drop2Position: {},
            areCirclesPlaced: false,
            angleDegrees: 0,
            isAngleLinePlace: false,
            showAddDropsWarning: true,
            showAngleActions: false,
            showAngleRePlaceWarning: false,
            isAngleFlipped: false,
        };

        // methods binding.
        this.teardropCounter = this.teardropCounter.bind(this);
        this.createTeardropline = this.createTeardropline.bind(this);
        this.setDropsPosition = this.setDropsPosition.bind(this);
        this.unbindEvent = this.unbindEvent.bind(this);
        this.onChangeAngle = this.onChangeAngle.bind(this);
        this.addAngleLine = this.addAngleLine.bind(this);
        this.rotateAngle = this.rotateAngle.bind(this);
        this.onAngleDragging = this.onAngleDragging.bind(this);
        this.showAngleActions = this.showAngleActions.bind(this);

        const stage = this.state.stage;
        const layer = this.state.layer;

        const circle = (x, y) => {
            return new Konva.Circle({
                x: x,
                y: y,
                radius: 8,
                fill: '#00a9ca',
                stroke: '#222222',
                strokeWidth: 2,
                draggable: true,
                dragBoundFunc: function(pos) {
                    var newX = pos.x > window.innerWidth ? window.innerWidth : pos.x;
                    return {
                        x: newX,
                        y: pos.y,
                    };
                }
            })
        };
        
        stage.add(layer);

        // Add listener to canvas, desktop and mobile.
        stage.on('contentClick contentTouchstart', () => {
            this.setState({
                showAddDropsWarning: false,
            });
            this.teardropCounter();
            const position = stage.getPointerPosition();
            stage.add(layer);
            layer.add(circle(position.x, position.y)).draw();
            this.setDropsPosition(position);
            if (this.state.maxTeardrops === 2) {
                this.createTeardropline();
                this.unbindEvent(stage);
                this.showAngleActions();
            }
        });
    }

    teardropCounter() {
        this.setState({
            maxTeardrops: ++this.state.maxTeardrops,
        });
    }

    setDropsPosition(position) {
        if (this.state.maxTeardrops === 2) {
            this.setState({
                drop2Position: position,
            });
        } else {
            this.setState({
                drop1Position: position,
            });
        }
    }

    createTeardropline() {
        const drop1Position = this.state.drop1Position;
        const drop2Position = this.state.drop2Position;
        const x1 = drop1Position.x;
        const y1 = drop1Position.y;
        const x2 = drop2Position.x;
        const y2 = drop2Position.y;

        let line;

        if (Object.keys(drop1Position).length !== 0 && Object.keys(drop2Position).length !== 0) {
            line = new Konva.Line({
                points: [x1, y1, x2, y2],
                stroke: '#00a9ca',
                strokeWidth: 4,
                lineCap: 'round',
                lineJoin: 'round',
                id: 'teardropLine',
                dash: [3, 10],
            });
        } else {
            console.warn('To create a line positions must not be empty object.');
        }

        let layer = this.state.layer.add(line);
        this.state.stage.add(layer);
        this.setState({
            areCirclesPlaced: true,
        });
    }

    /** 
     * 
     * Unbind touch/click event when the 
     * two teardrops are on screen.
     * 
    */
    unbindEvent(stage) {
        stage.off('contentClick contentTouchstart');
    }

    onDragging(circles, line) {
        const drop1 = circles[0];
        const drop2 = circles[1];
        const angleLine = this.state.stage.find('#angleLine')[0];

        drop1.on('dragmove', (event) => {
            const lastPos = event.currentTarget._lastPos;
            line.setPoints([lastPos.x, lastPos.y, drop2.attrs.x, drop2.attrs.y]);
            if (angleLine) {
                const x1 = (lastPos.x + drop2.attrs.x) / 2;
                const y1 = (lastPos.y + drop2.attrs.y) / 2;
                angleLine.setPoints([x1, y1, x1, y1]);
            }
        });
        drop2.on('dragmove', (event) => {
            const lastPos = event.currentTarget._lastPos;
            line.setPoints([drop1.attrs.x, drop1.attrs.y, lastPos.x, lastPos.y]);
            if (angleLine) {
                const x1 = (lastPos.x + drop1.attrs.x) / 2;
                const y1 = (lastPos.y + drop1.attrs.y) / 2;
                angleLine.setPoints([x1, y1, x1, y1]);
            }
        });

        // TODO: add showAngleRePlaceWarning() on drag stop for both teardrops.
    }

    showAngleRePlaceWarning() {
        this.setState({
            showAngleRePlaceWarning: true,
        });
    }

    addAngleLine(angleHasRotation) {
        const line = this.state.stage.find('#teardropLine')[0];
        const currentAngleLine = this.state.stage.find('#angleLine')[0];

        let degrees = this.state.angleDegrees;
        if (!angleHasRotation) {
            degrees = 180 - this.state.angleDegrees;
            this.setState({
                isAngleFlipped: true,
            });
        } else {
            degrees = degrees;
            this.setState({
                isAngleFlipped: false,
            });
        }

        if (currentAngleLine) {
            currentAngleLine.destroy();
            this.showAngleRePlaceWarning();
            if (this.state.isAngleLinePlace) {
                this.setState({
                    isAngleLinePlace: false,
                });
            }
        }

        const startingPosX = line.attrs.points[0];
        const startingPosY = line.attrs.points[1];
        const startingPosX2 = line.attrs.points[2];
        const startingPosY2 = line.attrs.points[3];

        const startingAngleLinePointX = (startingPosX + startingPosX2) / 2;
        const startingAngleLinePointY = (startingPosY + startingPosY2) / 2;

        const lineLength = 250;
        const endingPointAngleLineX = startingAngleLinePointX - (lineLength * Math.cos(Math.PI * degrees / 180));
        const endingPointAngleLineY = startingAngleLinePointY - (lineLength * Math.sin(Math.PI * degrees / 180));

        const angleLine = new Konva.Line({
            points: [startingAngleLinePointX, startingAngleLinePointY, endingPointAngleLineX, endingPointAngleLineY],
            stroke: '#49ca00',
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round',
            id: 'angleLine',
            draggable: true,
            dragBoundFunc: (pos) => {
                return {
                    x: pos.x,
                    y: this.state.stage.find('#teardropLine')[0].getAbsolutePosition().y,
                }
            },
            dash: [3, 10],
        });

        this.state.layer.add(angleLine);
        this.state.stage.add(this.state.layer);
        this.state.stage.draw();

        this.setState({
            isAngleLinePlace: true,
            showAngleRePlaceWarning: false,
        });

    }

    onChangeAngle(event) {
        this.setState({
            angleDegrees: event.currentTarget.value,
        });
    }

    rotateAngle() {
        const isFlipped = this.state.isAngleFlipped;

        this.addAngleLine(isFlipped);
        if (isFlipped) {
            this.setState({
                isAngleFlipped: false,
            });
        } else {
            this.setState({
                isAngleFlipped: true,
            });
        }
    }

    onAngleDragging() {
        const angleLine = this.state.stage.find('#angleLine')[0];

        angleLine.on('dragmove', (event) => {
            console.log('dragmove angle');
        });
    }

    showAngleActions() {
        this.setState({
            showAngleActions: true,
        });
    }

    render() {
        const addDropsWarning = <div className="notifications">Please, add teardrops by touching the image.</div>;
        const placeAngleWarning = <div className="notifications">Please, re place your Inklination angle line.</div>;
        const angleActions = <div className="graphics-buttons buttons">
            <div className="angle-input">
                <label>Add angle degrees:</label>
                <input type="text" onChange={this.onChangeAngle} />
                <div className="clearfix"></div>
            </div>
            <div className="angle-buttons">
                <button onClick={this.addAngleLine}>Place angle</button>
                <button onClick={this.rotateAngle}>Flip angle</button>
            </div>
        </div>;
        // handle drops dragging and line placement while dragging.
        if (this.state.areCirclesPlaced) {
            const circles = this.state.stage.find('Circle');
            const line = this.state.stage.find('#teardropLine')[0];
            this.onDragging(circles, line);
        }
        if (this.state.isAngleLinePlace) {
            this.onAngleDragging();
        }
        return <div>
                {!this.state.isAngleLinePlace && !this.state.showAddDropsWarning && this.state.showAngleRePlaceWarning ? placeAngleWarning: null}
                {this.state.showAddDropsWarning ? addDropsWarning : null}
                {this.state.showAngleActions ? angleActions : null}
            </div>; 
    }
}

export default Graphics;