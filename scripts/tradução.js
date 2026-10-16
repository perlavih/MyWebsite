// Language translations and language toggle behavior.
const languageToggle = document.querySelector('#language-toggle');
const translations = {
  'Recycle Bin': 'Lixeira', 'Home': 'Início', 'Portfolio': 'Portfólio',
  'Commissions': 'Comissões',
  'My Profile': 'Meu perfil', 'Profile information': 'Informações do perfil',
  'Welcome to my website!': 'Bem-vindo ao meu site!', 'About me': 'Sobre mim',
  'Status': 'Status', 'Games': 'Jogos', 'Music': 'Música', 'Media': 'Mídia',
  'Art Gallery': 'Galeria de arte', 'Menu': 'Menu',
  'Toggle gallery filters': 'Abrir ou fechar filtros da galeria',
  'Art preview': 'Prévia da arte', 'Close preview': 'Fechar prévia',
  'Previous image': 'Imagem anterior', 'Next image': 'Próxima imagem',
  'All my arts': 'Todos', 'Drawings': 'Desenhos',
  'Welcome to the Art gallery! This place is my Portfolio where I post all my arts and in "Fanarts" you can find others people arts too!':
    'Bem-vindo à galeria de arte! Aqui é meu portfólio onde eu posto minhas artes e em “Fanarts” você também encontra artes de outras pessoas!',
  '-- Coming soon! --': '-- Em breve! --', 'Art Gallery': 'Galeria de arte',
  'Commissions': 'Comissões',
  'Mode: Day': 'Modo: dia', 'Mode: Night': 'Modo: noite', 'Credits': 'Créditos',
  'Translate to Portuguese': 'Traduzir para português',
  'Translate to English': 'Traduzir para inglês',
  'Switch themes': 'Alternar tema',
  'She • Her': 'Ela • Dela',
  '19y | Brazilian | Artist | Student | Web & GFX Designer': '19 anos | Artista | Estudante | Designer Web e Gráfica',
  'Im a Girl!': 'Garota!', 'Demisexual': 'Demissexual',
  'Taken': 'Namorando', 'Artist': 'Artista',
  'I used to play a lot of flash games and old': 'Eu costumava jogar muitos jogos em Flash e jogos antigos de',
  'Games': 'Jogos',
  'Hi! I\'m this is my own place on the internet, where you\'ll find stuff about me, my hobbies, my interests, my art portfolio, and more. Hope you like and enjoy it!':
    'Oiii! Este é meu cantinho na internet, onde você encontra coisas sobre mim, meus hobbies, meus interesses, meu portfólio de arte e muito mais. Espero que goste!',
  'This website was all made by me, full inspired on the Windows 7 OS layout and the y2k Frutiger Aero aesthetic. Also, some of my own style. Besides it runs better on a desktop, this site can also function on mobie devices, but make sure to check it on a desktop to see excusive stuff!':
    'Fiz este site inspirado no visual do Windows 7 e na estética Y2K Frutiger Aero<, com um pouco do meu próprio estilo também. Ele foi criado para ser acessado no desktop<, por mais que também possa ser mobile-friendly. Porém, para ter uma experiência melhor, acesse o site pelo computador!!',
  'The windows are all functionable. Click on the maximized button at the window to open full mode, the minimized button and the close button will close the window. But, you can acess them again at the taskbar anytime you want. You can use the translate (Portuguese) and the theme buttons to change them with your prefrences. It\'s theme changes depending on your local timezone.':
    'Todas as janelas são interativas. Clique no botão de maximizar para abrir a janela em tela cheia, os botões de minimizar e fechar fazem o que seus nomes indicam. Mas, você também pode reabri-las de novo pela barra de tarefas sempre que quiser. Use os botões de idioma e tema para mudá-los para sua preferência, o tema muda de acordo com o horário local.',
  'Here are some games that I\'m currently playing (And want to play):':
    'Aqui estão alguns jogos que eu jogo atualmente (ou quero jogar):',
  'My music taste is basically all envolved into the EDM genres, my favorite one being Dubstep! Others genres and subgenres that I like includes Future bass, Melodic dubstep, Hardstyle, Techno, Rocktronic, Metalstep, Midtempo and Progressive house.':
    'Meu gosto musical gira em torno de gêneros de EDM, dubstep sendo o meu favorito! Também gosto de future bass, melodic dubstep, hardstyle, techno, rocktronic, metalstep, midtempo e progressive house.',
  'Here are some of the music producers that I like to listen:':
    'Aqui estão alguns produtores musicais que gosto de ouvir:',
  'So, here\'s a list of some indie series that I like to watch:':
    'Aqui está uma lista de séries independentes que gosto de assistir:'
};

if (languageToggle) {
  const originalTexts = new WeakMap();
  const originalAttributes = new WeakMap();
  let currentLanguage = localStorage.getItem('site-language') === 'pt-BR' ? 'pt-BR' : 'en';
  const homeParagraphsPt = [
    'Oiii! Este é meu cantinho na internet, onde você encontra <b>coisas sobre mim, meus hobbies, meus interesses, meu portfólio de arte e muito mais.</b> Espero que goste!',
    'Fiz este site inspirado no visual do <b>Windows 7</b> e na estética <b>Y2K Frutiger Aero</b>, com um pouco do meu próprio estilo também. Ele foi criado para ser acessado no <b>desktop</b>, por mais que também possa ser <b>mobile-friendly</b>. Porém, para ter uma experiência melhor, acesse o site pelo computador!!',
    'Todas as janelas são interativas. Clique no botão de <b>maximizar</b> para abrir a janela em tela cheia, os botões de <b>minimizar</b> e <b>fechar</b> fazem o que seus nomes indicam. Mas, você também pode reabri-las de novo pela <b>barra de tarefas</b> sempre que quiser. Use os botões de <b>idioma</b> e <b>tema</b> para mudá-los para sua preferência, o tema muda de acordo com o horário local.'
  ];
  const richTextTranslations = [
    ['.profile-info', '19 anos | Artista | Estudante | Designer Web e Gráfica'],
    ['.secao > .articles:first-child article p.sticker', 'about'],
    ['.secao2 > .articles:nth-child(1) article > p.sticker', 'Eu costumava jogar muitos jogos em Flash e jogos antigos de <b>PS2 e Nintendo</b> entre <b>2009 e 2015</b>, mas hoje só jogo no meu pc.'],
    ['.secao2 > .articles:nth-child(1) article > p.sticker:nth-of-type(2)', '<img class="sticker-right" style="width: 120px;" src="assets/img/console.png" alt="">Aqui estão alguns jogos que estou <b>jogando atualmente</b> (e que quero jogar):'],
    ['.secao2 > .articles:nth-child(2) article > p.sticker:nth-of-type(1)', 'Meu gosto musical gira principalmente em torno dos gêneros de <b>EDM</b>, e meu favorito é <b>dubstep</b>! Também gosto de future bass, melodic dubstep, hardstyle, techno, rocktronic, metalstep, midtempo e progressive house.'],
    ['.secao2 > .articles:nth-child(2) article > p.sticker:nth-of-type(2)', '<img class="sticker-right" style="width: 110px;" src="assets/img/radio.png" alt="">Aqui estão alguns <b>produtores musicais</b> que gosto de ouvir:'],
    ['.secao2 > .articles:nth-child(3) article > p.sticker:nth-of-type(1)', 'O que costumo consumir é principalmente <b>mídia independente</b>. Não sou muito fã de séries ou animes de serviços de streaming, com exceção de filmes de <b>animação</b>, que amo e assisto como se eu fosse uma criança de novo!'],
    ['.secao2 > .articles:nth-child(3) article > p.sticker:nth-of-type(2)', '<img class="sticker-right" style="width: 120px;" src="assets/img/dogpc.png" alt="">E aqui está uma lista de <b>séries independentes</b> que gosto de assistir:']
  ];
  const aboutTranslations = [
    '<img class="sticker-small" src="assets/icons/emoticon.png" width="50px" alt="">Sou <b>Perla Vitoria</b>, estudante de <b>Sistemas de Informação</b> em uma universidade federal. Tento viver a vida como uma jovem adulta introvertida, com ansiedade social. Nasci em <b>2006</b>, curto a ideia da junção entre natureza e tecnologia e espero que, no futuro, possamos tornar o mundo um lugar diferente.',
    '<img class="sticker-right" src="assets/img/pc.png" alt=""> Minhas habilidades incluem <b>programar</b>, <b>fazer designs</b> e <b>desenhar</b>! quero melhorar um pouquinho nisso todos os dias. Também adoro astronomia e zoologia! Amo todos os animais, especialmente <b>coelhinhos</b> e <b>focas</b>! A minha cor favorita é <b>Ciano</b>, meu humor é meio nonsense (rio de literalmente qualquer coisa kkk) e um pouco ácido. O que me deixa feliz todos os dias são minhas <b>amizades</b> e meu <b>relacionamento</b>. Quero cuidar deles assim como cuidam de mim <3'
  ];

  function setSiteLanguage(language) {
    const portuguese = language === 'pt-BR';
    document.documentElement.lang = portuguese ? 'pt-BR' : 'en';

    const welcomeParagraphs = document.querySelectorAll('.articles-panel > .articles:first-child article p');
    welcomeParagraphs.forEach((paragraph, index) => {
      if (index >= homeParagraphsPt.length) return;
      if (!paragraph.dataset.originalHtml) paragraph.dataset.originalHtml = paragraph.innerHTML;
      paragraph.innerHTML = portuguese ? homeParagraphsPt[index] : paragraph.dataset.originalHtml;
    });

    richTextTranslations.forEach(([selector, portugueseHtml]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (portugueseHtml === 'about') {
          if (!element.dataset.originalHtml) element.dataset.originalHtml = element.innerHTML;
          const aboutHtml = aboutTranslations[index];
          if (aboutHtml) element.innerHTML = portuguese ? aboutHtml : element.dataset.originalHtml;
          return;
        }
        if (!element.dataset.originalHtml) element.dataset.originalHtml = element.innerHTML;
        element.innerHTML = portuguese ? portugueseHtml : element.dataset.originalHtml;
      });
    });

    // Translate complete text nodes, preserving inline formatting such as <b>.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const source = node.nodeValue.trim();
      if (!source) continue;
      if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
      const original = originalTexts.get(node);
      const key = original.trim();
      if (portuguese && translations[key]) {
        node.nodeValue = original.replace(key, translations[key]);
      } else if (!portuguese) {
        node.nodeValue = original;
      }
    }

    document.querySelectorAll('[aria-label], [title], img[alt]').forEach((element) => {
      if (!originalAttributes.has(element)) {
        originalAttributes.set(element, {
          'aria-label': element.getAttribute('aria-label'),
          title: element.getAttribute('title'),
          alt: element.getAttribute('alt')
        });
      }
      const originals = originalAttributes.get(element);
      for (const attribute of ['aria-label', 'title', 'alt']) {
        const value = originals[attribute];
        if (value === null) continue;
        const translated = translations[value];
        if (portuguese && translated) element.setAttribute(attribute, translated);
        else element.setAttribute(attribute, value);
      }
    });

    currentLanguage = language;
    localStorage.setItem('site-language', language);
    const label = portuguese ? 'Translate to English' : 'Translate to Portuguese';
    languageToggle.setAttribute('aria-label', label);
    languageToggle.title = label;
  }

  languageToggle.addEventListener('click', () => {
    setSiteLanguage(currentLanguage === 'en' ? 'pt-BR' : 'en');
  });
  if (currentLanguage === 'pt-BR') setSiteLanguage('pt-BR');
}
