import type {NextFunction, Request, Response, RequestHandler, ErrorRequestHandler} from 'express'

type Middleware<CustomRequest, CustomResponse, CustomNextFunction, Output = unknown> = (
  req: CustomRequest,
  res: CustomResponse,
  next: CustomNextFunction,
) => Promise<Output> | void

type ErrorHandler<CustomRequest, CustomResponse, CustomNextFunction, Output = unknown> = (
  err: unknown,
  req: CustomRequest,
  res: CustomResponse,
  next: CustomNextFunction,
) => Promise<Output> | void


const isPromiseLike = <T>(element: unknown): element is Promise<T> => {
  return typeof element === 'object' && element !== null && 'then' in element
}

/**
 * Утилитарный type guard для приведения к RequestHandler
 */
export function isRequestHandler<
  CustomRequest extends Request = Request,
  CustomResponse extends Response = Response,
  CustomNextFunction extends NextFunction = NextFunction,
  MiddlewareOutput = unknown,
>(
  middleware: Middleware<CustomRequest, CustomResponse, CustomNextFunction, MiddlewareOutput>,
): middleware is RequestHandler {
  return typeof middleware === 'function'
}

/**
 * Утилитарный type guard для приведения к ErrorRequestHandler
 */
export function isErrorRequestHandler<
  CustomRequest extends Request = Request,
  CustomResponse extends Response = Response,
  CustomNextFunction extends NextFunction = NextFunction,
  MiddlewareOutput = unknown,
>(
  middleware: ErrorHandler<CustomRequest, CustomResponse, CustomNextFunction, MiddlewareOutput>,
): middleware is ErrorRequestHandler {
  return typeof middleware === 'function'
}

/**
 * Утилита для создания express мидлвар
 *  - корректно обрабатывает асинхронные мидлвары
 *  - позволяет работать с расширенным `Request` типом
 *
 * Eсли в express добавить мидлвару с async/await и там произойдет исключение,
 * то оно не будет поймано и произойдет unhandled rejection. В лучшем случае процесс упадет,
 * в худшем обрабатываемый запрос просто "зависнет" в воздухе.
 *
 * Есть два выхода:
 *
 * 1) тело каждой мидлвары оборачивать в try..catch
 *    > server.use(async (_, _, next) => try {...} catch (e) {next(e)} )
 *
 * 2) использовать createMiddleware
 *    > server.use(createMiddleware(asyncMiddleware))
 */
 export function createMiddleware<
 CustomRequest extends Request = Request,
 CustomResponse extends Response = Response,
 CustomNextFunction extends NextFunction = NextFunction,
 MiddlewareOutput = unknown,
>(middleware: Middleware<CustomRequest, CustomResponse, CustomNextFunction, MiddlewareOutput>): RequestHandler {
 function wrappedMiddleware(req: CustomRequest, res: CustomResponse, next: CustomNextFunction) {
   let maybePromise
   try {
     maybePromise = middleware(req, res, next)
   } catch (err) {
     next(err)
     return
   }
   if (isPromiseLike(maybePromise)) {
     // eslint-disable-next-line promise/no-callback-in-promise
     maybePromise.catch(next)
   }
 }
 // без type guard'а пришлось бы кастить сначала к unknown и только потом к RequestHandler
 if (isRequestHandler(wrappedMiddleware)) {
   return wrappedMiddleware as RequestHandler
 }
 throw new TypeError('middleware must be a request handler')
}

