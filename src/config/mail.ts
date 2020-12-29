interface IMailConfig {
  driver: 'ethereal' | 'ses'
  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: 'Cadu the Coder',
      email: 'cadu@gobarberapp.page',
    },
  },
} as IMailConfig
