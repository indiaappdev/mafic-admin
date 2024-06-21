import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from 'src/app/shared/shared-data.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-edit-user-pop',
  templateUrl: './edit-user-pop.component.html',
  styleUrls: ['./edit-user-pop.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserPopComponent implements OnInit {
  userDetails:any=[];

  validPattern = "^[a-zA-Z0-9#?!@$%^&*-]{8,12}$";
  phonePattern = "^[0-9]{10}$";
  emailPattern = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"

    // Form control variables
    editAFirstName =       new FormControl('', [Validators.required]);
    editALastName =        new FormControl('', [Validators.required]);
    editAEmailID =         new FormControl('', [Validators.required, Validators.email,Validators.pattern(this.emailPattern)]);
    editAPhoneNumber =     new FormControl('', [Validators.required,Validators.pattern(this.phonePattern)]);

    editJFirstName =       new FormControl('', [Validators.required]);
    editJLastName =        new FormControl('', [Validators.required]);
    editJEmailID =         new FormControl('', [Validators.required, Validators.email,Validators.pattern(this.emailPattern)]);
    editJPhoneNumber =     new FormControl('', [Validators.required,Validators.pattern(this.phonePattern)]);
    editJTypeOfArt =       new FormControl('', [Validators.required]);
    editJTypeOfArtText =   new FormControl('');
    editActiveState =      new FormControl(false);
    editJExperience =      new FormControl('', [Validators.required]);
    editRole =             new FormControl('', [Validators.required]);
    // End
    typeOfArtArray = ['painting','photography','cutlery','crockery','jewelry','fashion','home_decor','home_furnishing']

    regTypeArtOther:boolean = false;
    regTypeArt:string;
    roleData:any=[];

  public editUserForm: FormGroup = new FormGroup({
    firstname: this.editJFirstName,
    lastname: this.editJLastName,
    emailId: this.editJEmailID,
    role:this.editRole,
    phnNum:this.editJPhoneNumber,
    typArt:this.editJTypeOfArt,
    exprnc:this.editJExperience
  });

  public editUserFormArt: FormGroup = new FormGroup({
    firstname: this.editAFirstName,
    lastname: this.editALastName,
    emailId: this.editAEmailID,
    role:this.editRole,
    phnNum:this.editAPhoneNumber
  });


  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'mobileNo', 'emailId','role'];
  sDataource:any=[];
  constructor(private http: HttpClient,
    public dialogRef: MatDialogRef<EditUserPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public sData:SharedDataService) {
    console.log('data', this.data);
    this.userDetails = this.data.userID;
    
  }

  onChangeType(value:any){
    this.regTypeArt = value.value;
    if(this.regTypeArt == 'other'){
      this.regTypeArtOther = true;
    } else{
      this.regTypeArtOther = false;
    }
  }

  validateFormFields() {
    if (this.editJFirstName.hasError('required') || this.editJLastName.hasError('required') || this.editRole.hasError('required')) {
      return 'Mandatory field';
    } else
    return this.editRole.hasError('required') ? 'Mandatory field' : '';
  }

  emailValidator(){
    if (this.editJEmailID.hasError('required')) {
      return 'Mandatory field';
    } else if(this.editJEmailID.hasError('email'))
        return 'Not a valid email'
      else  if(this.editJEmailID.hasError('pattern'))
      return 'Not a valid email';
      else
      return '';
  }

  phoneNumberValidator(){
    if (this.editJPhoneNumber.hasError('required'))
    return 'Please enter your PhoneNumber';
    else if (this.editJPhoneNumber.hasError('pattern')) {
    return 'Please Enter valid PhoneNumber';
    }
    else
    return '';
  }
  string:string=''
  ngOnInit(): void {
    if(this.userDetails.roles == 'Artist'){
    this.resetFormA();
    } else{
      this.resetForm();
    }

    this.http.post(''+this.sData.apiDomainPathDash+'getRole',{}) // Get user details
    .subscribe(data => {
      console.log(data);
      this.sData.hideLoader();
      this.roleData = data;
      this.roleData = this.roleData.response;
    });
  }

  resetFormA(){
    this.editAEmailID.reset(this.userDetails.emailId);
    this.editAFirstName.reset(this.userDetails.firstName);
    this.editALastName.reset(this.userDetails.lastName);
    this.editAPhoneNumber.reset(this.userDetails.mobileNo);
    this.editRole.reset(this.userDetails.roleId);
    if(this.userDetails.isActive == 1)
      this.editActiveState.reset(true);
    else
    this.editActiveState.reset(false);
  }


  resetForm(){
    this.editJEmailID.reset(this.userDetails.emailId);
    this.editJFirstName.reset(this.userDetails.firstName);
    this.editJLastName.reset(this.userDetails.lastName);
    this.editJPhoneNumber.reset(this.userDetails.mobileNo);
    this.editJExperience.reset(this.userDetails.experience);
    this.editRole.reset(this.userDetails.roleId);
    if(this.userDetails.isActive == 1)
      this.editActiveState.reset(true);
    else
    this.editActiveState.reset(false);

    if(this.typeOfArtArray.includes(this.userDetails.interestCat))
    this.editJTypeOfArt.reset(this.userDetails.interestCat);
    else{
      this.editJTypeOfArt.reset('other');
      this.regTypeArtOther = true;
      this.editJTypeOfArtText.reset(this.userDetails.interestCat)
    }
  }
  editRes:any = []
  editUserData(){;
    let regType='';
    if(!this.regTypeArtOther){
      regType = this.editJTypeOfArt.value;
    }  else{
      regType = this.editJTypeOfArtText.value;
    }
    this.sData.showLoader();
    let activeState = 0
    if(this.editActiveState.value)
      activeState = 1;
    else
      activeState = 0;
    let eUserData = {};
    eUserData = {
      emailId:this.editJEmailID.value, 
      firstName:this.editJFirstName.value, 
      lastName:this.editJLastName.value, 
      role:this.editRole.value,
      userId:this.userDetails.id,
      mobileNo:this.editJPhoneNumber.value,
      experience:this.editJExperience.value,
      interestCat:regType,
      active:activeState
    }
   
    
    this.http.post(''+this.sData.apiDomainPathDash+'editUser',eUserData) // Delete user details
    .subscribe(data => {
      console.log('User deleted',data);
      this.sData.hideLoader();
      this.editRes = data;
      if(this.editRes.responseCode == 200)
      this.sData.firePopup(true,'User data editted');
      else
      this.sData.firePopup(false,this.editRes.responseMsg);
    },
    err => {
      // Swal.fire(err);
    });
  }
}
