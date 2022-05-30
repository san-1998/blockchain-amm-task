import styled from 'styled-components';
import { Link } from "react-router-dom";

interface Extend {
    extend:boolean;
}

export const NavbarContainer=styled.div`
    width: 100%;
    height:60px;
    background-color:black;
    display:flex;
    flex-direction:column; 
`;


export const Heading1=styled.h4`
    padding:16px;
    color:white;
`;


export const LeftContainer=styled.div`
    flex:70%;
    display:flex;
    align-items:center;
    padding-left:5px;
    
`;


export const RightContainer=styled.div`
     flex:30%;
     display:flex;
     align-items:center;
     padding-right:5px;
     backgound-color:orange;
`;

export const NavbarInnerContainer=styled.div`
         width:100%;
         height:60px;
         display:flex;
`;

export const NavbarLinkContainer=styled.div`
        display:flex;
`;

export const NavbarLink=styled(Link)`
        font-size:1rem;
        text-decoration:none;
        color:white;
        margin:10px;
       
        @media (max-width:576px){
            display:none;
        }

`;

export const Logo=styled.img`
       margin:auto;
       padding:auto;
`;

export const OpenLinkButton=styled.button`
      width:70px;
      height:50px;
      color:white;
      border:none;
      cursor:pointer;
      background:none;
      font-size:40px;

      @media (min-width:576px){
          display:none;
      }

`;

export const ExtendedNavbar=styled.div`
`;