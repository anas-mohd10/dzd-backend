export interface FieldMap {
    title: string
    fieldMap: string
    isVisible: boolean
    isRequired: boolean
    label?: string
    placeholder?: string
    type?: string
    options?: any[]
    validationPattern?: string
}

export const addressFieldsMap: FieldMap[] = [
    { title: 'Name', fieldMap: 'name', isVisible: true, isRequired: true },
    { title: 'Country Code', fieldMap: 'countryCode', isVisible: true, isRequired: true },
    { title: 'Mobile', fieldMap: 'mobile', isVisible: true, isRequired: true },
    { title: 'Type', fieldMap: 'type', isVisible: true, isRequired: true },
    { title: 'Firstlane', fieldMap: 'firstlane', isVisible: true, isRequired: true },
    { title: 'Secondlane', fieldMap: 'secondlane', isVisible: true, isRequired: true },
    { title: 'Area', fieldMap: 'area', isVisible: true, isRequired: true },
    { title: 'Landmark', fieldMap: 'landmark', isVisible: true, isRequired: true },
    { title: 'City', fieldMap: 'city', isVisible: true, isRequired: true },
    { title: 'State', fieldMap: 'state', isVisible: true, isRequired: true },
    { title: 'Pincode', fieldMap: 'pincode', isVisible: true, isRequired: true },
    { title: 'Country', fieldMap: 'country', isVisible: true, isRequired: true },
]

export const loginFieldsMap: FieldMap[] = [
    { title: 'Email', fieldMap: 'email', isVisible: true, isRequired: true },
    { title: 'Password', fieldMap: 'password', isVisible: true, isRequired: true },
]