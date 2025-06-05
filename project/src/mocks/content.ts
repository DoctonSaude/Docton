import { EducationalContent } from '../types';

export const mockContent: EducationalContent[] = [
  {
    id: 'content-1',
    title: 'Como controlar a hipertensão com alimentação saudável',
    summary: 'Dicas práticas para controlar a pressão arterial através de uma alimentação balanceada.',
    content: `
# Como controlar a hipertensão com alimentação saudável

A hipertensão arterial, conhecida popularmente como "pressão alta", afeta milhões de brasileiros e é um dos principais fatores de risco para doenças cardiovasculares. Felizmente, mudanças na alimentação podem ajudar a controlar os níveis pressóricos.

## Dicas importantes:

### 1. Reduza o consumo de sal
O sódio presente no sal é um dos principais vilões da pressão alta. Procure limitar o consumo para menos de 5g por dia (aproximadamente uma colher de chá).

### 2. Aumente o consumo de potássio
Alimentos ricos em potássio, como banana, batata-doce, feijão e abacate, ajudam a equilibrar os níveis de sódio no organismo.

### 3. Prefira alimentos naturais
Evite alimentos processados e ultraprocessados, que geralmente contêm muito sódio e conservantes.

### 4. Consuma mais frutas e vegetais
Além de ricos em vitaminas e minerais, eles são fontes de antioxidantes que ajudam na saúde cardiovascular.

### 5. Inclua alimentos ricos em ômega-3
Peixes como salmão, sardinha e atum contêm ácidos graxos que ajudam a reduzir a inflamação e a pressão arterial.

Lembre-se: estas mudanças devem ser parte de um tratamento mais amplo, que pode incluir medicamentos prescritos pelo seu médico. Nunca interrompa o uso de medicamentos sem orientação profissional.
    `,
    category: ['Alimentação', 'Hipertensão', 'Cardiologia'],
    imageUrl: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking.jpg',
    authorId: 'professional-1',
    publishDate: new Date('2025-04-10'),
    relatedConditions: ['Hipertensão', 'Doenças cardiovasculares']
  },
  {
    id: 'content-2',
    title: 'Exercícios para diabéticos: o que você precisa saber',
    summary: 'Guia completo sobre atividades físicas seguras e eficazes para pessoas com diabetes.',
    content: `
# Exercícios para diabéticos: o que você precisa saber

A prática regular de exercícios físicos é fundamental no tratamento do diabetes, pois ajuda a melhorar a sensibilidade à insulina e a controlar os níveis de glicose no sangue. No entanto, é importante saber como se exercitar de forma segura.

## Benefícios dos exercícios para diabéticos

- Melhora do controle glicêmico
- Redução da resistência à insulina
- Controle do peso corporal
- Redução do risco de doenças cardiovasculares
- Melhora do bem-estar geral e da qualidade de vida

## Tipos de exercícios recomendados

### 1. Exercícios aeróbicos
Caminhada, natação, ciclismo e dança são excelentes opções. Comece com 10-15 minutos por dia e aumente gradualmente até atingir 30 minutos, 5 vezes por semana.

### 2. Treinamento de força
O trabalho muscular com pesos ou resistência do próprio corpo ajuda a aumentar a massa muscular, que contribui para melhorar o metabolismo da glicose. Recomenda-se 2-3 sessões por semana.

### 3. Exercícios de flexibilidade
Alongamentos e yoga ajudam a prevenir lesões e melhorar a amplitude de movimento.

## Precauções importantes

- Sempre consulte seu médico antes de iniciar um programa de exercícios
- Monitore sua glicemia antes, durante (em sessões longas) e após o exercício
- Tenha sempre à mão uma fonte rápida de carboidratos (como gel de glicose) em caso de hipoglicemia
- Use calçados adequados e examine os pés regularmente
- Hidrate-se adequadamente

Lembre-se: a consistência é mais importante que a intensidade. É melhor fazer exercícios moderados regularmente do que sessões intensas esporádicas.
    `,
    category: ['Exercícios', 'Diabetes', 'Endocrinologia'],
    imageUrl: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg',
    videoUrl: 'https://www.youtube.com/embed/example',
    authorId: 'professional-2',
    publishDate: new Date('2025-04-15'),
    relatedConditions: ['Diabetes tipo 1', 'Diabetes tipo 2']
  },
  {
    id: 'content-3',
    title: 'Gerenciando a ansiedade: técnicas de respiração e mindfulness',
    summary: 'Aprenda técnicas práticas para reduzir a ansiedade no dia a dia através da respiração consciente e mindfulness.',
    content: `
# Gerenciando a ansiedade: técnicas de respiração e mindfulness

A ansiedade é uma resposta natural do corpo a situações de estresse, mas quando se torna excessiva, pode afetar negativamente nossa qualidade de vida. Técnicas de respiração e mindfulness têm se mostrado eficazes para reduzir os sintomas de ansiedade.

## Técnicas de respiração

### 1. Respiração diafragmática (respiração abdominal)
- Sente-se confortavelmente ou deite-se
- Coloque uma mão no peito e outra no abdômen
- Inspire lentamente pelo nariz, sentindo o abdômen expandir
- Expire lentamente pela boca, sentindo o abdômen contrair
- Repita por 5-10 minutos

### 2. Respiração 4-7-8
- Inspire pelo nariz contando mentalmente até 4
- Segure a respiração contando até 7
- Expire completamente pela boca contando até 8
- Repita 4 vezes

## Práticas de mindfulness

### 1. Meditação da atenção plena
- Reserve 5-10 minutos por dia
- Sente-se em um local tranquilo
- Concentre-se em sua respiração
- Quando perceber que sua mente vagou, gentilmente traga sua atenção de volta à respiração
- Não julgue seus pensamentos, apenas observe-os e deixe-os passar

### 2. Escaneamento corporal
- Deite-se confortavelmente
- Concentre sua atenção em diferentes partes do corpo, uma de cada vez
- Comece pelos dedos dos pés e vá subindo até a cabeça
- Observe as sensações em cada parte sem julgamento

## Integrando na rotina

Tente incorporar essas práticas em sua rotina diária. Mesmo 5 minutos por dia podem fazer diferença. A consistência é mais importante que a duração das sessões.

Lembre-se: essas técnicas são complementares ao tratamento médico. Se você sofre de transtorno de ansiedade, busque ajuda profissional.
    `,
    category: ['Saúde Mental', 'Ansiedade', 'Mindfulness'],
    imageUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg',
    authorId: 'professional-3',
    publishDate: new Date('2025-04-20'),
    relatedConditions: ['Ansiedade', 'Estresse', 'Insônia']
  }
];