import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate, Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-contest',
  templateUrl: './add-contest.component.html',
  styleUrls: ['./add-contest.component.css']
})

export class AddContestComponent implements OnInit {

  selectedFile: File;
  file_data:any;
  file_name:string = '';
  file_size:number = 800001;
  acceptableImageArray = ['image/png','image/jpg','image/jpeg'];
  fileAccept:boolean= false;
  uploadImageUrl:any = '';
  fileInfos?: Observable<any>;
  progress:number;
  message:string;
  uploader:boolean = false;

  file_type:any;
  type_valid:boolean = false;

  name =              new FormControl('', [Validators.required]);
  type =              new FormControl('', [Validators.required]);
  city =              new FormControl('');
  category =          new FormControl('');
  cost =              new FormControl('', [Validators.required]);
  startDate =         new FormControl('');
  endDate =           new FormControl('');
  roundOneSDate =     new FormControl('');
  roundOneEDate =     new FormControl('');
  roundTwoSDate =     new FormControl('');
  roundTwoEDate =     new FormControl('');
  roundThreeSDate =   new FormControl('');
  roundThreeEDate =   new FormControl('');
  winner =            new FormControl('');
  firstRunner =       new FormControl('');
  secondRunner =      new FormControl('');
  description =       new FormControl('');
  descriptionHeader = new FormControl('');
  theme =             new FormControl('');
  categoryData:any = [];


  bannerImage(event:any){
    if(event.target.files.length > 0){
      this.fileAccept = false;
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      let fileType = this.selectedFile.type;
      if(this.acceptableImageArray.includes(fileType)){
        const reader = new FileReader();
        this.type_valid = true;
        // this.imagePath = files;
        reader.readAsDataURL(this.selectedFile); 
        reader.onload = () => { 
            
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const height = img.naturalHeight;
                const width = img.naturalWidth;
                console.log('Width and Height', width, height);
                if(width>=1920 && height>1080){
                this.fileAccept= true; 
                this.uploadImageUrl = reader.result; 
                } else{
                this.data.firePopup(false,'Please upload HD image (1920 x 1080)');
                this.fileAccept= false;
                }
            };
        }
      } else{
        this.data.firePopup(false,'Please upload only PNG/JPEG format');
        this.fileAccept= false;
      }
    }
    console.log(this.selectedFile);
  }

  public addContestForm: FormGroup = new FormGroup({
    type:       this.type,
    name:       this.name,
    city:       this.city,
    category:   this.category,
    cost:       this.cost,
    startDate:  this.startDate,
    endDate:    this.endDate,
    rosDate:    this.roundOneSDate,
    roeDat:     this.roundOneEDate,
    rtsDate:    this.roundTwoSDate,
    rteDate:    this.roundTwoEDate,
    rthsDate:   this.roundThreeSDate,
    rtheDate:   this.roundThreeSDate,
    description:this.description,
    descriptionHeader:this.description,
    theme:      this.theme,
    winner:     this.winner,
    firstRunner:this.firstRunner,
    seondRunner:this.secondRunner
  });

  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService) { }

  ngOnInit(): void {
    this.data.hideLoader();
    this.http.get(''+this.data.apiDomainPathDash+'getCategory',{}) // Get Category details
    .subscribe(data => {
      console.log(data);
      this.categoryData = data;
      this.categoryData = this.categoryData.response
    });
  }

  onChangeType(value:any){
    let val = value.value;
    if(val == 'free'){
      this.cost.reset('0');
      this.addContestForm.controls['cost'].disable();
    } else{
      this.addContestForm.controls['cost'].enable();
    }
  }

  validateFormFields() {
    if (this.name.hasError('required') || this.type.hasError('required') || this.category.hasError('required')|| this.startDate.hasError('required') || this.endDate.hasError('required') || this.roundOneSDate.hasError('required') || this.roundOneEDate.hasError('required') || this.roundTwoSDate.hasError('required') || this.roundTwoEDate.hasError('required') || this.roundThreeSDate.hasError('required') || this.roundThreeEDate.hasError('required') || this.winner.hasError('required') || this.firstRunner.hasError('required') || this.secondRunner.hasError('required') || this.cost.hasError('required') || this.theme.hasError('required') || this.description.hasError('required') || this.descriptionHeader.hasError('required') ) {
     return 'Mandatory field';
    } else
    return '';
  }

  addContest(){

    let sDate = '';
    let eDate = '';

    if (this.startDate.value && this.endDate.value) {
      eDate = formatDate(this.endDate.value, 'yyyy-MM-dd', 'en-US');
      sDate = formatDate(this.startDate.value, 'yyyy-MM-dd', 'en-US');
      if (sDate>=eDate) {
        this.data.firePopup(false,'Check start date and end date');
        return;
      }
    } 
    if (!this.fileAccept){
        // this.snak.open("Image should be jpg, png ","OK", {"duration": 2000});
        this.data.firePopup(false,'Please upload an image');
        return;
     }
    else{
      var uploadData;
        uploadData = new FormData();
        uploadData.append('imageURL', this.selectedFile, this.selectedFile.name);
        console.log(uploadData);
        uploadData.append('type', this.type.value);
        uploadData.append('city', this.city.value);
        uploadData.append('name', this.name.value);
        uploadData.append('category', this.category.value);
        uploadData.append('cost', this.cost.value);
        uploadData.append('startDate', sDate);
        uploadData.append('endDate', eDate);
        uploadData.append('description', this.description.value);
        uploadData.append('descriptionHeader', this.descriptionHeader.value);
        uploadData.append('roundOneStartDate', this.roundOneSDate.value);
        uploadData.append('roundOneEndDate', this.roundOneSDate.value);
        uploadData.append('roundTwoStartDate', this.roundTwoSDate.value);
        uploadData.append('roundTwoEndDate', this.roundTwoEDate.value);
        uploadData.append('roundThreeStartDate', this.roundThreeSDate.value);
        uploadData.append('roundThreeEndDate', this.roundThreeEDate.value);
        uploadData.append('winner', this.winner.value);
        uploadData.append('runnerUp', this.firstRunner.value);
        uploadData.append('secondRunnerUp', this.secondRunner.value);
        uploadData.append('theme', this.theme.value);

      this.data.showLoader();
      console.log(uploadData);
      this.http.post(''+this.data.apiDomainPathDash+'addContest',uploadData) // Get user details
      .subscribe(data => {
        console.log(data);
        this.data.firePopup(true,'Data inserted successfully');
        this.data.hideLoader();
        this.router.navigate(['/contest']);
      },
      err => {
        // Swal.fire(err);
      });
  }

 }
 
}
