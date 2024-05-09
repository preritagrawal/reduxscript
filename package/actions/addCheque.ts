
import { ActionType, createAction } from 'typesafe-actions';
import { IErrorActionData } from '../../utils/error';

export enum AddChequeActionTypes {
  ADD_CHEQUE = 'ADD_CHEQUE',
  ADD_CHEQUE_SUCCESS = 'ADD_CHEQUE_SUCCESS',
  ADD_CHEQUE_FAILURE = 'ADD_CHEQUE_FAILURE',
  RESET_ADD_CHEQUE = 'RESET_ADD_CHEQUE',
}


export interface IAddChequeRequestData {
 // Add required types here
}

export const addCheque = createAction(
  AddChequeActionTypes.ADD_CHEQUE
)<IAddChequeRequestData>();
export const addChequeSuccess = createAction(
  AddChequeActionTypes.ADD_CHEQUE_SUCCESS
)();
export const addChequeFailure = createAction(
  AddChequeActionTypes.ADD_CHEQUE_FAILURE
)<IErrorActionData>();
export const resetaddCheque = createAction(
  AddChequeActionTypes.RESET_ADD_CHEQUE
)();

export type AddChequeAction = ActionType<typeof addCheque>;
type AddChequeSuccessAction = ActionType<typeof addChequeSuccess>;
type AddChequeFailureAction = ActionType<typeof addChequeFailure>;
type ResetAddChequeAction = ActionType<typeof resetaddCheque>;

export type AddChequeActions =
  | AddChequeAction
  | AddChequeSuccessAction
  | AddChequeFailureAction
  | ResetAddChequeAction;
  