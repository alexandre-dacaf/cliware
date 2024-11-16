import { Blueprint } from 'types';
import { createTodo } from './actions';
import { coreCommands } from './core/coreCommands';

export const blueprint: Blueprint = {
    ...coreCommands,
    todo: {
        entrypoint: 'q1',
        pipeline: {
            q1: {
                type: 'prompt',
                promptType: 'autocomplete',
                message: 'Digite1:',
                choices: [
                    { value: 'checking_account', label: 'Conta Corrente' },
                    { value: 'savings_account', label: 'Conta Poupança' },
                    { value: 'credit_card', label: 'Cartão de Crédito' },
                    { value: 'debit_card', label: 'Cartão de Débito' },
                    { value: 'personal_loan', label: 'Empréstimo Pessoal' },
                    { value: 'mortgage', label: 'Financiamento Imobiliário' },
                    { value: 'auto_loan', label: 'Financiamento de Veículo' },
                    { value: 'investment_account', label: 'Conta de Investimento' },
                    { value: 'insurance', label: 'Seguro' },
                    { value: 'retirement_plan', label: 'Plano de Aposentadoria' },
                    { value: 'certificate_of_deposit', label: 'Certificado de Depósito' },
                    { value: 'money_market', label: 'Fundo de Mercado' },
                    { value: 'mutual_fund', label: 'Fundo Mútuo' },
                    { value: 'forex', label: 'Câmbio' },
                    { value: 'wealth_management', label: 'Gestão de Patrimônio' },
                    { value: 'business_account', label: 'Conta Empresarial' },
                    { value: 'wire_transfer', label: 'Transferência Internacional' },
                    { value: 'mobile_banking', label: 'Banco Móvel' },
                    { value: 'online_banking', label: 'Banco Online' },
                    { value: 'atm_withdrawal', label: 'Saque em ATM' },
                    { value: 'cash_deposit', label: 'Depósito em Dinheiro' },
                    { value: 'loan_repayment', label: 'Pagamento de Empréstimo' },
                    { value: 'credit_score_check', label: 'Consulta de Score de Crédito' },
                    { value: 'financial_advisory', label: 'Consultoria Financeira' },
                    { value: 'tax_advice', label: 'Consultoria Fiscal' },
                    { value: 'student_loan', label: 'Empréstimo Estudantil' },
                    { value: 'home_equity_loan', label: 'Empréstimo com Garantia Imobiliária' },
                    { value: 'line_of_credit', label: 'Linha de Crédito' },
                    { value: 'brokerage_account', label: 'Conta de Corretora' },
                    { value: 'robo_advisor', label: 'Robo-Advisor' },
                    { value: 'investment_fund', label: 'Fundo de Investimento' },
                    { value: 'crypto_trading', label: 'Negociação de Criptomoedas' },
                    { value: 'loan_application', label: 'Solicitação de Empréstimo' },
                ],
                next: 'q2',
            },
            q2: {
                type: 'prompt',
                promptType: 'number',
                message: 'Digite2:',
                // next: 'act',
                next: (context) => {
                    if (context.pipelineData['q2'] === 12) {
                        return 'weeb';
                    }
                    return 'act';
                },
            },
            act: {
                type: 'action',
                actionFunction: createTodo,
                next: 'weeb',
            },
            weeb: {
                type: 'action',
                actionFunction: (context) => {
                    context.printer.printOutput(
                        `Respostas: ${JSON.stringify(context.pipelineData)}`
                    );
                },
            },
        },
    },
};
