import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
    let sidebar = body.querySelector("nav");
    let sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
  sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
  body.classList.toggle("dark");
  if(body.classList.contains("dark")){
      localStorage.setItem("mode", "dark");
  }else{
      localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if(sidebar.classList.contains("close")){
      localStorage.setItem("status", "close");
  }else{
      localStorage.setItem("status", "open");
  }
})
  }
  dropdown:any = document.getElementsByClassName("dropdown-btn");
  i:number=0;
  
  // for(i = 0; i < dropdown.length; i++){
  //   dropdown[i].addEventListener("click", function() {
  //     this.classList.toggle("active");
  //     var dropdownContent = this.nextElementSibling;
  //     if (dropdownContent.style.display === "block") {
  //       dropdownContent.style.display = "none";
  //     } else {
  //       dropdownContent.style.display = "block";
  //     }
  //   });
  // }
}
