export const taxRulesEndpoints = {
    add_tax_rules: '/upload-tax-rules',
    get_tax_rules: '/tax-rules',
    get_active_tax_rules: '/active-tax-rules',
    get_tax_rules_by_slug: '/tax-rules',
    update_tax_rules_status: '/update-tax-rules', //PATCH method - updates the tax_rules status
    update_tax_rules: '/update-tax-rules', //PUT method - updates the tax_rules body
    delete_tax_rules: '/delete-tax-rules'
}