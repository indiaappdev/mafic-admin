import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate, Location } from '@angular/common'
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-contest',
  templateUrl: './edit-contest.component.html',
  styleUrls: ['./edit-contest.component.css']
})

export class EditContestComponent implements OnInit {

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

  contestId:string;
  contestDetails:any = [];

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
  imgUrl              :string;
  categoryData:any = [];


  public addContestForm: FormGroup = new FormGroup({
    type:       this.type,
    name:       this.name,
    cost:       this.cost
  });

  bannerImage(event:any){
    if(event.target.files.length > 0){
      this.fileAccept = false;
      this.selectedFile = event.target.files[0]
      this.file_name = this.selectedFile.name;
      this.file_size = this.selectedFile.size;
      let fileType = this.selectedFile.type;
      if(this.acceptableImageArray.includes(fileType)){
        const reader = new FileReader();
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

  constructor(private http: HttpClient,private location: Location, private router:Router,
              public data:SharedDataService, private snak:MatSnackBar, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.data.hideLoader();
    
    const routeParams = this.route.snapshot.paramMap;
    this.contestId = String(routeParams.get('cId'));

    this.http.post(''+this.data.apiDomainPath+'eventDetails',{id:this.contestId}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.contestDetails = data;
      this.contestDetails = this.contestDetails.response[0];
      if(this.contestDetails.type == 'free'){
      this.cost.reset('0');
      this.addContestForm.controls['cost'].disable();
      }
      this.setData(this.contestDetails)
    });

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

  setData(data:any){
    if (data.name)
      this.name.reset(data.name);
    if (data.type)
      this.type.reset(data.type);
    if (data.city)
      this.city.reset(data.city);
    if (data.category)
      this.category.reset(data.category);
    if (data.cost)
      this.cost.reset(data.cost);
    this.startDate.reset(data.startDate);
    this.endDate.reset(data.endDate);
    if (data.description)
      this.description.reset(data.description);
    if (data.descriptionHeader)
      this.descriptionHeader.reset(data.descriptionHeader);
    if (data.theme)
      this.theme.reset(data.theme);
    this.roundOneSDate.reset(data.roundOneStartDate);
    this.roundOneEDate.reset(data.roundOneEndDate);
    this.roundTwoSDate.reset(data.roundTwoStartDate);
    this.roundTwoEDate.reset(data.roundTwoEndDate);
    this.roundThreeSDate.reset(data.roundThreeStartDate);
    this.roundThreeEDate.reset(data.roundThreeEndDate);
    this.winner.reset(data.winner);
    this.firstRunner.reset(data.runnerUp);
    this.secondRunner.reset(data.secondRunnerUp);
    this.imgUrl = data.imageURL;
  }

  validateFormFields() {
    if (this.name.hasError('required') || this.type.hasError('required') || this.category.hasError('required')|| this.startDate.hasError('required') || this.endDate.hasError('required') || this.roundOneSDate.hasError('required') || this.roundOneEDate.hasError('required') || this.roundTwoSDate.hasError('required') || this.roundTwoEDate.hasError('required') || this.roundThreeSDate.hasError('required') || this.roundThreeEDate.hasError('required') || this.winner.hasError('required') || this.firstRunner.hasError('required') || this.secondRunner.hasError('required') || this.cost.hasError('required') || this.theme.hasError('required') || this.description.hasError('required') || this.descriptionHeader.hasError('required') ) {
     return 'Mandatory field';
    } else
    return '';
  }

  editContest(){

    let sDate = '';
    let eDate = '';
    let r1sDate = '';
    let r1eDate = '';
    let r2sDate = '';
    let r2eDate = '';
    let r3sDate = '';
    let r3eDate = '';

    if (this.startDate.value && this.endDate.value && this.startDate.value != '' && this.endDate.value != '') {
      eDate = formatDate(this.endDate.value, 'yyyy-MM-dd', 'en-US');
      sDate = formatDate(this.startDate.value, 'yyyy-MM-dd', 'en-US');
      if (sDate>=eDate) {
        this.data.firePopup(false,'Check start date and end date');
        return;
      }
    }  if (this.roundOneSDate.value && this.roundOneSDate.value != '' && this.roundOneEDate.value && this.roundOneEDate.value != '') {
      r1sDate = formatDate(this.roundOneSDate.value, 'yyyy-MM-dd', 'en-US');
      r1eDate = formatDate(this.roundOneEDate.value, 'yyyy-MM-dd', 'en-US');
      if ((r1sDate>r1eDate)){
        this.data.firePopup(false,'Check round one start date and end date');
        return;
      }
    }  if (this.roundTwoSDate.value && this.roundTwoSDate.value != '' && this.roundTwoEDate.value && this.roundTwoEDate.value != '') {
      r2sDate = formatDate(this.roundTwoSDate.value, 'yyyy-MM-dd', 'en-US');
      r2eDate = formatDate(this.roundTwoEDate.value, 'yyyy-MM-dd', 'en-US');
      if ((r2sDate>r2eDate)){
        this.data.firePopup(false,'Check round two start date and end date');
        return;
      }
    }  if (this.roundThreeSDate.value && this.roundThreeSDate.value != '' && this.roundThreeEDate.value && this.roundThreeEDate.value != '') {
      r3sDate = formatDate(this.roundThreeSDate.value, 'yyyy-MM-dd', 'en-US');
      r3eDate = formatDate(this.roundThreeEDate.value, 'yyyy-MM-dd', 'en-US');
      if ((r3sDate>r3eDate)){
        this.data.firePopup(false,'Check round three start date and end date');
        return;
      }
    }

    this.data.showLoader();
    const uploadData = new FormData();
    if(this.fileAccept)
      uploadData.append('imageURL', this.selectedFile, this.selectedFile.name);
    uploadData.append('type', this.type.value);
    uploadData.append('contestId', this.contestId);
    uploadData.append('city', this.city.value);
    uploadData.append('name', this.name.value);
    uploadData.append('category', this.category.value);
    uploadData.append('cost', this.cost.value);
    uploadData.append('startDate', sDate);
    uploadData.append('endDate', eDate);
    uploadData.append('description', this.description.value);
    uploadData.append('descriptionHeader', this.descriptionHeader.value);
    uploadData.append('roundOneStartDate', r1sDate);
    uploadData.append('roundOneEndDate', r1eDate);
    uploadData.append('roundTwoStartDate', r2sDate);
    uploadData.append('roundTwoEndDate', r2eDate);
    uploadData.append('roundThreeStartDate', r3sDate);
    uploadData.append('roundThreeEndDate', r3eDate);
    uploadData.append('winner', this.winner.value);
    uploadData.append('runnerUp', this.firstRunner.value);
    uploadData.append('secondRunnerUp', this.secondRunner.value);
    uploadData.append('theme', this.theme.value);
    debugger
    this.http.post(''+this.data.apiDomainPathDash+'editContest',uploadData) // Get user details
    .subscribe(data => {
      console.log(data);
      // this.snak.open("Data updated successfully","OK", {"duration": 4000})
      this.data.firePopup(true,'Data updated successfully');
      this.data.hideLoader();
      this.router.navigate(['/contest']);
    },
    err => {
      // Swal.fire(err);
    });
}
}

