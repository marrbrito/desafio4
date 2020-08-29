import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    // ---Verifica se possui saldo suficiente para a operacao, quando saida
    if (type === 'outcome' && value > total) {
      throw Error('Insufficient balance');
    }

    // ---Verifica se o tipo de transacao é um valor válido
    if (!['income', 'outcome'].includes(type)) {
      throw Error('The type should be income or outcome');
    }

    // ---Chama o metodo do repositorio para efetivar a persistencia
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
