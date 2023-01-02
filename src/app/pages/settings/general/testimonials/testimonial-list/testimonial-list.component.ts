import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes/app.routes';
import { TestimonialService } from 'src/app/includes/services/testimonial.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  appRoute = appRoutes
  testimonialsData: any
  base: any;

  constructor(private testimonialService: TestimonialService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.base = environment.base
    this.getTestimonials()
  }

  getTestimonials() {
    this.testimonialService.getTestimonials().subscribe((res: any) => {
      this.testimonialsData = res?.result
      this.cdr.markForCheck()
    })
  }

}
