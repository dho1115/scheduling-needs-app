export const NavigationLinks = (role, objects = null) => {
   try {
      if (role == 'supervisor') {
         return [
            { name: "Add Shift", to: "/" },
            { name: "Cancel Shift(s)", to: `/${objects.role}/welcome/${objects.id}/available shifts` }
         ]
      } else if (role == 'candidate') {
         return [
            
         ]
      } else throw new Error(`Please Enter a valid role as the first argument!!! You have ${role} as the first argument!!!`)
   } catch (error) {
      console.error({ message: 'Error in Navigation links!!!', error, errorCode: error.code, errorMessage: error.message, status: error.status, objectsIs: objects })
      return [
         { name: "FUCK!!! SOMETHING...", to: "/", restrictions: null },
         { name: "WENT...", to: "/", restrictions: null },
         { name: "WRONG.", to: "/", restrictions: null },
      ]
   } //Only catches error(s) in RUN TIME!!!
}