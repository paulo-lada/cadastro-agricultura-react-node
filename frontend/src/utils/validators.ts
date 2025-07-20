export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === Number(cpf[10]);
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const t = cnpj.length - 2;
  const d = cnpj.substring(t);
  const calc = (x: number) => {
    let n = cnpj.substring(0, x);
    let y = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      sum += Number(n[x - i]) * y--;
      if (y < 2) y = 9;
    }

    const res = 11 - (sum % 11);
    return res > 9 ? 0 : res;
  };

  return calc(t) === Number(d[0]) && calc(t + 1) === Number(d[1]);
}
