const rolePermissions = {
  admin: ['view_leads', 'create_lead', 'edit_lead', 'delete_lead', 'manage_users'],
  support_staff: ['edit_lead'],
  sales_rep: ['view_leads']
};

 module.exports = rolePermissions;
