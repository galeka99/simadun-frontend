import Swal from 'sweetalert2'

const Toast = {
  info: function (message: string) {
    Swal.fire({
      icon: 'info',
      toast: true,
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      padding: 15,
      position: 'top-end',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      }
    })
  },

  error: function (message: string) {
    Swal.fire({
      icon: 'error',
      toast: true,
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      padding: 15,
      position: 'top-end',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      }
    })
  },

  success: function (message: string) {
    Swal.fire({
      icon: 'success',
      toast: true,
      text: message,
      showCloseButton: false,
      showConfirmButton: false,
      timer: 3700,
      timerProgressBar: true,
      padding: 15,
      position: 'top-end',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      }
    })
  },
}

export default Toast
