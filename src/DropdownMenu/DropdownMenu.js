import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"

/*
    File: DropdownMenu.js
    Description: Just a dropdown menu that can will display under a component. However, it is ESSENTIAL it is 
    right below the component you want it to belong to. It will automagically reposition itself in the browser window. 

    Props:
    props.maxHeight sets the max height for the menu
    props.height Sets the height for the menu.
    props.width Sets the width for the menu.
    props.isVisible Sets the visibilty of the menu!

*/
class DropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classProp: "show",
      isFadedOut: false,
      isFirstRun: true,
      windowWidth: null,
      windowHeight: null,
      menuWidth: null,
      menuTranslate: -(this.props.width/2),
    }
    this.menuWindow = React.createRef()
    
  }
  componentDidMount() {
    
    window.addEventListener("resize", this.handleResize)

   

  }
  //***************************
  checkOutsideHandle = (e) =>{
    if(this.menuWindow.current!=null){
    if (!this.menuWindow.current.contains(e.target)&&this.menuWindow) {
      if(this.props.isVisible){
        this.props.onMenuClose()
    
      }  
    }
    }
  }
  //***************************
  componentWillUnmount() {

    window.removeEventListener("resize", this.handleResize)
  }
  handleResize = event =>{
    try{
      if (this.menuWindow.current != null) {
        this.setState({
          isFirstRun: true,
        })
        this.checkTranslate();
        this.setState({
          isFirstRun: false,
        })
      }
    }catch(e){
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      
    }}
  
  }

  checkTranslate = () => {
   // Add this for mouse events

    try{
      if (this.state.isFirstRun) {
        var mWidth =
          this.menuWindow.current.getBoundingClientRect().right -
          this.menuWindow.current.getBoundingClientRect().left
        this.setState({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          menuTranslate: -1 * (mWidth / 2),
        })

        var rightSideDistance = ~~(
          window.innerWidth -
          this.menuWindow.current.getBoundingClientRect().right
        )
        var leftSideDistance = this.menuWindow.current.getBoundingClientRect()
          .left

        if (rightSideDistance <= 20.0 && leftSideDistance <= 20) {
          if (rightSideDistance < leftSideDistance) {
            this.setState({
              menuTranslate: -1 * mWidth + 20,
            })
          } else {
            this.setState({
              menuTranslate: -1 * (mWidth / 2),
            })
          }
        }
        if (rightSideDistance <= 20.0) {
          this.setState({
            menuTranslate: -1 * mWidth + 20,
          })
        } else if (leftSideDistance <= 20) {
          this.setState({
            menuTranslate: 1 * -20,
          })
        } else {
          this.setState({
            menuTranslate: -1 * (mWidth / 2),
          })
        }
      }
    }catch(e){
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
            console.log(e)
          
        }}
  }

  ChangeFirstRun = () => {
    //***************************
    this.AddListener()
    //***************************
    this.setState({
      isFirstRun: false,
    })
  }
  //***************************
  AddListener = () =>{
       window.addEventListener('click', this.checkOutsideHandle, false);

  }
  RemoveListener = () =>{
    window.removeEventListener('click', this.checkOutsideHandle, false);

  }
//***************************
  render() {
    try {
      return this.props.isVisible ? (
        <Wrapper
          onAnimationStart={this.checkTranslate}
          onAnimationEnd={this.ChangeFirstRun}
          style={{ visibility: "show" }}
          className="show"
          
        >
          <TriangleTop 
          //***************************
          onClick={e => {
            // We are simply preventing the e based function up above from misfiring
            e.stopPropagation()
          
          }}
          //***************************
           />
          <MainContainer
          //***************************
          onClick={e => {
            // We are simply preventing the e based function up above from misfiring
            e.stopPropagation()
          }}
          //***************************
            ref={this.menuWindow}
            style={{
              transform: "translateX(" + this.state.menuTranslate + "px",
              width:""+this.props.width+"px",
            }}
          >
            <InnerChildContainer>{this.props.children}</InnerChildContainer>
          </MainContainer>
        </Wrapper>
      ) : !this.state.isFirstRun ? (
        <Wrapper className="hide"  
        //***************************
         onAnimationEnd={this.RemoveListener}
         //***************************
         >
          <TriangleTop />
          <MainContainer
            style={{
              transform: "translateX(" + this.state.menuTranslate + "px",
              width:""+this.props.width+"px",
            }}
          >
            <InnerChildContainer>{this.props.children}</InnerChildContainer>
          </MainContainer>
        </Wrapper>
      ) : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default DropdownMenu

const FadeIn = keyframes`
from {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  transform:  rotateX(-20deg);
  transform: translateY(15.5px) translateX(50%);

  opacity: 0;
} 
to {
  transform-style: preserve-3d;
  transform-origin: 0px 0px;
  
  transform: rotateX(0deg);
  transform: translateY(15.5px) translateX(50%);

  opacity: 0.99;
}
`
const FadeOut = keyframes`
from {
  transform-style: preserve-3d;
  transform:  rotateX(0deg);
  transform: translateY(15.5px) translateX(50%);

  visibility: visible;
  opacity: 0.99;
} 
to {
  transform-style: preserve-3d;
  transform:  rotateX(-30deg);
  transform: translateY(15.5px) translateX(50%);

  opacity: 0;
  
}
`

const MainContainer = styled.div`
  position: absolute;
  overflow: hidden;

  /* Shadows */
  box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
    0 30px 60px -30px rgba(0, 0, 0, 0.3),
    0 -18px 60px -10px rgba(0, 0, 0, 0.025);

  /* Background */
  background-color: ${props => props.containerColor || "white"};

  /* Dimensions */
  height: ${props => props.height || ""};

  max-height: ${props => props.maxHeight || "420px"};
  max-width: ${props => props.maxWidth || ""};


 /* width: ${props => `"`+props.width+`px` || "390px"}; */

  transform-origin: 0% 0%;
  will-change: transform, opacity;

  z-index: 0;

  /* Borders */
  border-radius: 8px;

  /* Item Alignment */
  display: flex;
  flex-shrink: 0;
  flex-direction: col;
  vertical-align: baseline;
  justify-content: center;

  /* Padding */
  padding: 20px;

  /* Fonts */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #000;
`
const Wrapper = styled.div`
position:relative;
/* positioning */

transform: translateY(15.5px) translateX(50%);
margin-left:auto; 
margin-right:auto;
/* Visibility */
visibility: hidden;

height:0;
width:100%;
will-change: transform, opacity;

/* Animations :D */
&.show {
  
  visibility: visible !important;
  animation: ${FadeIn} 0.15s ease-in;
}
&.hide {
  animation: ${FadeOut} 0.15s ease-in;
}

`
const InnerChildContainer = styled.div`
  align-items: center;
  flex: 1;
  vertical-align: baseline;
`

const TriangleTop = styled.div`
  /* dimensions */
  width: 25px;
  height: 25px;

  background-color: ${props => props.containerColor || "white"};

  /* transforms */
  transform: translateX(50%) translateX(-12.5px) translateY(-60%)
    translateY(0px) rotate(45deg);
  transform-origin: 0% 0%;
  will-change: transform, opacity;

  /* positioning */
  position: absolute;
  z-index: 1;
  left: auto;
  right: auto;

  /* Borders */
  border-radius: 2px;

  /*shadows*/
  box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
    0 30px 60px -30px rgba(0, 0, 0, 0.3),
    0 -18px 60px -10px rgba(0, 0, 0, 0.025);
`

DropdownMenu.propTypes = {
  height: PropTypes.string,
  width: PropTypes.number,
  isVisible: PropTypes.bool,
  onMenuClose: PropTypes.func,
}
DropdownMenu.defaultProps = {
  isVisible: false,
  width:290,
  // ***************************
  onMenuClose: function(){}
  //*************************** */
}
