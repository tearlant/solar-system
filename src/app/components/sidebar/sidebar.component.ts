import { Component, Inject, OnInit } from '@angular/core';
import * as jQuery from 'jquery';

// Based on https://colorlib.com/wp/template/bootstrap-sidebar-03/

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit { 
    ngOnInit() {
      (function($) {

          "use strict";
        
          var fullHeight = function() {
        
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function(){
              $('.js-fullheight').css('height', $(window).height());
            });
        
          };
          fullHeight();
        
          $('#sidebarCollapse').on('click', function () {
              $('#sidebar').toggleClass('active');
          });
        
        })(jQuery);
    }
}
