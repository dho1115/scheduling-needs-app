export const NavigationLinks = (objects = null) => {
   try {
      return [
         { name: "Login Page", to: "/", restrictions: null },
         { name: "View Available Shifts", to: `/${objects.role}/welcome/${objects.id}/available shifts`, restrictions: null },
         { name: "Add Shift", to: "/", restrictions: 'supervisor' },
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