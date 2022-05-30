import React,{FC,useState} from "react";
import * as Styles from './Navbar.style';
import LogoImage from '../assets/flipcartlogo.png'


const Navbar:FC= () => {
   
  const[extend,setExtend]=useState<boolean>(false);

  return (

        <Styles.NavbarContainer>
          <Styles.NavbarInnerContainer> 
            <Styles.LeftContainer>
              <Styles.NavbarLinkContainer>
               <Styles.NavbarLink to="/">Home</Styles.NavbarLink>
               <Styles.NavbarLink to="/about">About</Styles.NavbarLink>
               <Styles.NavbarLink to="/contact">Contact</Styles.NavbarLink>
               <Styles.NavbarLink to="/profile">Profile</Styles.NavbarLink>
               <Styles.OpenLinkButton onClick={()=>setExtend(!extend)}>
                 { extend? <>&#10005;</>:<>&#8801;</> }
               </Styles.OpenLinkButton>
              </Styles.NavbarLinkContainer>
              </Styles.LeftContainer>
             <Styles.RightContainer>
                {/* <Styles.Logo src={LogoImage}>
                </Styles.Logo> */}
             </Styles.RightContainer>
             {/* <Styles.Heading1>Hello World!</Styles.Heading1> */}
          </Styles.NavbarInnerContainer>
       </Styles.NavbarContainer>
    
  );
};

export default Navbar;
