export const NavigationLinks = (objects = null /* {role: ... } */) => {
   try {
      return [
         { name: "Login Page", to: "/", restrictions: null },
         { name: "View Available Shifts", to: `/${objects.role}/welcome/${objects.id}/available shifts`, restrictions: null },
         { name: "Add Shift", to: `/${objects.role}/welcome/${objects.id}/add shift`, restrictions: 'supervisor' },
         { name: "Shifts Applied For", to: `/candidate/welcome/${objects.id}/shifts/applied`, restrictions: 'candidate' },
         { name: "Shifts Awarded", to: `/candidate/welcome/${objects.id}/shifts/awarded`, restrictions: 'candidate' },
         { name: "Shifts With Applicants", to: `/supervisor/welcome/${objects.id}/shifts/applied`, restrictions: 'supervisor' },
         { name: "Assigned Shifts", to: `/supervisor/welcome/${objects.id}/shifts/awarded`, restrictions: 'supervisor' },
         { name: "Cancel Available Shift", to: "/", restrictions: 'supervisor' }
      ]
   } catch (error) {
      console.error({ message: 'Error in Navigation links!!!', error, errorCode: error.code, errorMessage: error.message, status: error.status, objectsIs: objects })
      return [
         { name: "FUCK!!! SOMETHING...", to: "/", restrictions: null },
         { name: "WENT...", to: "/", restrictions: null },
         { name: "WRONG.", to: "/", restrictions: null },
      ]
   } //Only catches error(s) in RUN TIME!!!
}