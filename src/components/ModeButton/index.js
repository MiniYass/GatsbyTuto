import React from "react"
// imgs
import DayIcon from "images/daymode.svg"
import NightIcon from  "images/nightmode.svg"
//style
import {ImgButton} from "./ModeButton.styles"

const ModeButton = ( {darkMode, setDarkMode }) => (
    <ImgButton
        src={darkMode ? NightIcon : DayIcon}
        alt="mode btn"
        onClick={()=> setDarkMode(prev => !prev)}
    />
)

export default ModeButton