
import { ActionType, createAction } from 'typesafe-actions';
import { IErrorActionData } from '../../utils/error';

export enum GetChequeActionTypes {
  GET_CHEQUE = 'GET_CHEQUE',
  GET_CHEQUE_SUCCESS = 'GET_CHEQUE_SUCCESS',
  GET_CHEQUE_FAILURE = 'GET_CHEQUE_FAILURE',
  RESET_GET_CHEQUE = 'RESET_GET_CHEQUE',
}


export interface IGetChequeRequestData {
 // Add required types here
}

export const getCheque = createAction(
  GetChequeActionTypes.GET_CHEQUE
)<IGetChequeRequestData>();
export const getChequeSuccess = createAction(
  GetChequeActionTypes.GET_CHEQUE_SUCCESS
)();
export const getChequeFailure = createAction(
  GetChequeActionTypes.GET_CHEQUE_FAILURE
)<IErrorActionData>();
export const resetgetCheque = createAction(
  GetChequeActionTypes.RESET_GET_CHEQUE
)();

export type GetChequeAction = ActionType<typeof getCheque>;
type GetChequeSuccessAction = ActionType<typeof getChequeSuccess>;
type GetChequeFailureAction = ActionType<typeof getChequeFailure>;
type ResetGetChequeAction = ActionType<typeof resetgetCheque>;

export type GetChequeActions =
  | GetChequeAction
  | GetChequeSuccessAction
  | GetChequeFailureAction
  | ResetGetChequeAction;
  