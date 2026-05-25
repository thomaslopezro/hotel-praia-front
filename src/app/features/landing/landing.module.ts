import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { ServicesComponent } from './components/services/services.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import { TestimonialsCardsComponent } from './components/testimonials/testimonials-cards/testimonials-cards.component';
import { ChatbotWidgetComponent } from '../../components/chatbot-widget/chatbot-widget.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    HeroComponent,
    RoomsComponent,
    ServicesComponent,
    GalleryComponent,
    TestimonialsComponent,
    ReservationComponent,
    FooterComponent,
    MapComponent,
    TestimonialsCardsComponent,
    ChatbotWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HomeComponent
  ]
})
export class LandingModule {}