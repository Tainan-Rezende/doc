import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Comece por Aqui',
    ImgSrc: 'img/programming.png',
    description: (
      <>
        Aprenda o básico da nossa API: como se autenticar e fazer sua primeira chamada em menos de 5 minutos.
      </>
    ),
  },
  {
    title: 'Referência da API',
    ImgSrc: 'img/gear.png',
    description: (
      <>
        Explore todos os endpoints. Veja detalhes sobre Depósitos, Saques,
        Clientes, PIX e muito mais.
      </>
    ),
  },
  {
    title: 'SDKs e Pacotes',
    ImgSrc: 'img/software-development.png',
    description: (
      <>
        Integre mais rápido com nossos pacotes. Temos exemplos prontos em
        Javascript (NPM), Python (Pip) e PHP (Composer).
      </>
    ),
  },
];


function Feature({ ImgSrc, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* 👇 Troque <Svg> por uma tag <img> padrão */}
        <img className={styles.featureSvg} src={ImgSrc} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}