import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';

interface MenuItem {
  title: string;
  icon: string;
  redirection: string;
  referenceId: string;
  index: number;
  menuItems?: MenuItem[];
  isExpanded?: boolean
}

@Component({
  selector: 'app-navigation-settings',
  templateUrl: './navigation-settings.component.html',
  styleUrls: ['./navigation-settings.component.scss']
})
export class NavigationSettingsComponent implements OnInit {
  modalRef?: BsModalRef
  form: FormGroup = new FormGroup({})
  menuForm: FormGroup = new FormGroup({})
  menuDocs: MenuItem[] = []
  menuItems: MenuItem[] = []
  appRoutes = appRoutes
  parentId: string | null = ''
  menuIcon: string | null = ''
  editingItem: any = null;

  constructor(
    private BsModalService: BsModalService,
    private HotToastService: HotToastService
  ) { }

  generateReferenceId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  ngOnInit(): void {
    this.menuForm = new FormGroup({
      title: new FormControl(''),
      redirection: new FormControl(''),
      icon: new FormControl(''),
      index: new FormControl(0)
    })

    this.form = new FormGroup({
      title: new FormControl(''),
      redirection: new FormControl(''),
      icon: new FormControl(''),
      referenceId: new FormControl('')
    })
  }

  handleIcon(event: { path: string }) {
    this.form.get('icon')?.setValue(event.path)
    this.menuIcon = event.path
  }

  clearIcon() {
    this.form.get('icon')?.setValue('')
    this.menuIcon = null
  }

  open(modal: any, parentId?: string, itemToEdit?: any) {
    this.editingItem = itemToEdit;
    
    if (itemToEdit) {
      this.form.patchValue({
        title: itemToEdit.title,
        redirection: itemToEdit.redirection,
        icon: itemToEdit.icon
      });
      
      if (itemToEdit.icon) {
        this.menuIcon = itemToEdit.icon;
      }
    } else {
      this.form.reset();
      this.menuIcon = null;
    }
    
    this.parentId = parentId || null;
    this.modalRef = this.BsModalService.show(modal, { class: 'modal-dialog-centered', ignoreBackdropClick: false })
  }

  deleteMenu(index: number) {
    this.menuDocs.splice(index, 1)
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.editingItem) {
        // Update existing item
        this.editingItem.title = formData.title;
        this.editingItem.redirection = formData.redirection;
        this.editingItem.icon = formData.icon;
      } else {
        // Create new item
        const newItem = {
          title: formData.title,
          redirection: formData.redirection,
          icon: formData.icon,
          referenceId: this.generateReferenceId(),
          menuItems: [],
          isExpanded: false,
          index: this.menuDocs.length + 1
        };

        if (this.parentId) {
          // Add as submenu item
          this.addSubMenuItem(this.menuDocs, this.parentId, newItem);
        } else {
          // Add as main menu item
          this.menuDocs.push(newItem);
        }
      }
      
      this.close();
    }
  }

  private addSubMenuItem(items: MenuItem[], parentId: string, newItem: MenuItem): boolean {
    for (let item of items) {
      if (item.referenceId === parentId) {
        if (!item.menuItems) {
          item.menuItems = []
        }
        newItem.index = item.menuItems.length + 1
        item.menuItems.push(newItem)
        return true
      }
      if (item.menuItems && item.menuItems.length > 0) {
        if (this.addSubMenuItem(item.menuItems, parentId, newItem)) {
          return true
        }
      }
    }
    return false
  }

  saveChanges() {
    console.log(this.menuDocs)
  }

  close() {
    this.modalRef?.hide()
    this.editingItem = null;
    this.form.reset()
    this.menuIcon = null;
  }

  deleteSubMenu(items: any[], index: number) {
    items.splice(index, 1);
  }

}
