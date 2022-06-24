export const taxClassesEndpoints = {
    add_tax_classes: '/upload-tax-classes',
    get_tax_classes: '/tax-classes',
    get_active_tax_classes: '/active-tax-classes',
    get_tax_classes_by_slug: '/tax-classes',
    get_tax_rules_name: '/tax-rules-names',
    update_tax_classes_status: '/update-tax-classes', //PATCH method - updates the tax_classes status
    update_tax_classes: '/update-tax-classes', //PUT method - updates the tax_classes body
    delete_tax_classes: '/delete-tax-classes'
}