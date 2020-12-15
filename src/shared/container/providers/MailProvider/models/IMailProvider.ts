import ISendMailProvider from '../dtos/ISendMailDTO'

export default interface IMailProvider {
  sendMail(data: ISendMailProvider): Promise<void>
}
