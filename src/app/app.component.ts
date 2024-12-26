import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { ScrollService } from './services/scroll.service';
import { NavmobileComponent } from './navmobile/navmobile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule, FooterComponent, NavmobileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front';
  constructor(private scrollService: ScrollService) {}
}
