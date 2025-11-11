export const NavigationLinks = (objects = null /* {role: ... } */, ...args) => {
   try {
      return [
         { name: "Login Page", to: "/", restrictions: null },
         { name: "View Available Shifts", to: `/${objects.role}/welcome/${objects.id}/available shifts`, restrictions: "candidate" },
         Array.from(args).includes("candidates") ? { name: "YOU'VE GOT CANDIDATES!!!", to: `/${objects.role}/welcome/${objects.id}/available shifts`, restrictions: "supervisor" } : { name: "OPEN SHIFTS", to: `/${objects.role}/welcome/${objects.id}/available shifts`, restrictions: "supervisor" },
         { name: "Add Shift", to: `/${objects.role}/welcome/${objects.id}/add shift`, restrictions: 'supervisor' },
         { name: "Shifts Pending Approval/Denial", to: `/candidate/welcome/${objects.id}/shifts/applied`, restrictions: 'candidate' },
         {name: "Approved Shifts Needing My Confirmation", to: `/candidate/welcome/${objects.id}/shifts/pending confirmation`, restrictions: 'candidate'},
         { name: "unconfirmed shifts", to: `/supervisor/welcome/${objects.id}/shifts/unconfirmed-shifts`, restrictions: 'supervisor' },
         { name: "My Assigned Shifts", to: `/candidate/welcome/${objects.id}/shifts/assigned to work`, restrictions: 'candidate'},
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