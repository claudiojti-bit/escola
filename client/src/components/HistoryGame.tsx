import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw, Check, X } from "lucide-react";

type Topic = 'brazil' | 'world' | 'dates' | 'random';

interface HistoryGameProps {
  topic: Topic;
  onExit: () => void;
}

interface Question {
  statement: string;
  isCorrect: boolean;
  explanation: string;
  category: string;
}

const TOTAL_QUESTIONS = 10;

const questions: Question[] = [
  // Brasil (60 questões)
  { statement: "O Brasil foi descoberto por Pedro Álvares Cabral em 1500.", isCorrect: true, explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500.", category: "brazil" },
  { statement: "A Independência do Brasil ocorreu em 7 de setembro de 1822.", isCorrect: true, explanation: "Dom Pedro I proclamou a independência às margens do rio Ipiranga.", category: "brazil" },
  { statement: "O Brasil foi uma monarquia durante todo o século XIX.", isCorrect: false, explanation: "O Brasil se tornou República em 15 de novembro de 1889.", category: "brazil" },
  { statement: "A escravidão foi abolida no Brasil em 1888 com a Lei Áurea.", isCorrect: true, explanation: "A Princesa Isabel assinou a Lei Áurea em 13 de maio de 1888.", category: "brazil" },
  { statement: "Getúlio Vargas governou o Brasil por 15 anos consecutivos.", isCorrect: true, explanation: "Vargas governou de 1930 a 1945, um total de 15 anos.", category: "brazil" },
  { statement: "A ditadura militar no Brasil durou de 1964 a 1985.", isCorrect: true, explanation: "O regime militar começou com o golpe de 1964 e terminou em 1985.", category: "brazil" },
  { statement: "Brasília foi inaugurada como capital em 1950.", isCorrect: false, explanation: "Brasília foi inaugurada em 21 de abril de 1960 por JK.", category: "brazil" },
  { statement: "A primeira capital do Brasil foi o Rio de Janeiro.", isCorrect: false, explanation: "A primeira capital foi Salvador, de 1549 a 1763.", category: "brazil" },
  { statement: "A Inconfidência Mineira ocorreu em 1789.", isCorrect: true, explanation: "A Inconfidência Mineira foi uma conspiração em 1789.", category: "brazil" },
  { statement: "Tiradentes foi o único condenado à morte na Inconfidência.", isCorrect: true, explanation: "Tiradentes foi enforcado em 21 de abril de 1792.", category: "brazil" },
  { statement: "O Brasil foi governado por Portugal até 1808.", isCorrect: false, explanation: "A família real chegou ao Brasil em 1808, mas a independência só ocorreu em 1822.", category: "brazil" },
  { statement: "D. Pedro II foi o último imperador do Brasil.", isCorrect: true, explanation: "D. Pedro II reinou de 1840 a 1889.", category: "brazil" },
  { statement: "A Guerra do Paraguai durou de 1864 a 1870.", isCorrect: true, explanation: "Foi o maior conflito armado da América do Sul.", category: "brazil" },
  { statement: "O voto feminino no Brasil foi permitido em 1932.", isCorrect: true, explanation: "O Código Eleitoral de 1932 permitiu o voto feminino.", category: "brazil" },
  { statement: "A Era Vargas começou com a Revolução de 1930.", isCorrect: true, explanation: "Getúlio Vargas assumiu o poder após a Revolução de 1930.", category: "brazil" },
  { statement: "O AI-5 foi decretado em 1968.", isCorrect: true, explanation: "O Ato Institucional nº 5 foi o mais repressivo da ditadura.", category: "brazil" },
  { statement: "As Diretas Já ocorreram em 1984.", isCorrect: true, explanation: "O movimento pedia eleições diretas para presidente.", category: "brazil" },
  { statement: "A Constituição atual do Brasil é de 1988.", isCorrect: true, explanation: "A Constituição Cidadã foi promulgada em 5 de outubro de 1988.", category: "brazil" },
  { statement: "O Plano Real foi criado em 1990.", isCorrect: false, explanation: "O Plano Real foi implementado em 1994.", category: "brazil" },
  { statement: "Fernando Henrique Cardoso foi o primeiro presidente eleito após a redemocratização.", isCorrect: false, explanation: "Fernando Collor foi o primeiro, em 1989.", category: "brazil" },
  { statement: "A Revolta da Vacina ocorreu em 1904.", isCorrect: true, explanation: "Foi uma revolta popular contra a vacinação obrigatória no Rio de Janeiro.", category: "brazil" },
  { statement: "A Semana de Arte Moderna foi em 1922.", isCorrect: true, explanation: "Ocorreu em São Paulo, marcando o modernismo brasileiro.", category: "brazil" },
  { statement: "A Coluna Prestes percorreu o Brasil de 1925 a 1927.", isCorrect: true, explanation: "Liderada por Luís Carlos Prestes, percorreu 25 mil km.", category: "brazil" },
  { statement: "O Estado Novo de Vargas começou em 1937.", isCorrect: true, explanation: "Vargas implantou a ditadura do Estado Novo em 10 de novembro de 1937.", category: "brazil" },
  { statement: "A FEB lutou na Segunda Guerra na Itália.", isCorrect: true, explanation: "A Força Expedicionária Brasileira combateu na Itália em 1944-1945.", category: "brazil" },
  { statement: "Juscelino Kubitschek criou o Plano de Metas.", isCorrect: true, explanation: "JK prometeu '50 anos em 5' com seu Plano de Metas.", category: "brazil" },
  { statement: "Jânio Quadros renunciou em 1961.", isCorrect: true, explanation: "Jânio renunciou após apenas 7 meses de governo.", category: "brazil" },
  { statement: "João Goulart foi deposto pelo golpe de 1964.", isCorrect: true, explanation: "Jango foi deposto pelos militares em 31 de março de 1964.", category: "brazil" },
  { statement: "O milagre econômico brasileiro foi nos anos 1970.", isCorrect: true, explanation: "O período de grande crescimento econômico foi de 1968 a 1973.", category: "brazil" },
  { statement: "Tancredo Neves foi o primeiro presidente civil após a ditadura.", isCorrect: false, explanation: "Tancredo morreu antes de assumir; José Sarney foi o primeiro.", category: "brazil" },
  { statement: "Fernando Collor sofreu impeachment em 1992.", isCorrect: true, explanation: "Collor renunciou durante o processo de impeachment.", category: "brazil" },
  { statement: "O Brasil venceu 5 Copas do Mundo de futebol.", isCorrect: true, explanation: "O Brasil é pentacampeão mundial (1958, 1962, 1970, 1994, 2002).", category: "brazil" },
  { statement: "A Cabanagem ocorreu no Pará.", isCorrect: true, explanation: "A Cabanagem (1835-1840) foi uma revolta popular no Pará.", category: "brazil" },
  { statement: "A Balaiada ocorreu no Maranhão.", isCorrect: true, explanation: "A Balaiada (1838-1841) foi uma revolta no Maranhão.", category: "brazil" },
  { statement: "A Farroupilha foi uma revolução no Rio Grande do Sul.", isCorrect: true, explanation: "A Guerra dos Farrapos durou de 1835 a 1845.", category: "brazil" },
  { statement: "Canudos foi liderado por Antônio Conselheiro.", isCorrect: true, explanation: "A Guerra de Canudos ocorreu no sertão da Bahia (1896-1897).", category: "brazil" },
  { statement: "A Revolta da Chibata foi liderada por João Cândido.", isCorrect: true, explanation: "Marinheiros se revoltaram contra castigos físicos em 1910.", category: "brazil" },
  { statement: "O Contestado foi um conflito entre Paraná e Santa Catarina.", isCorrect: true, explanation: "A Guerra do Contestado ocorreu de 1912 a 1916.", category: "brazil" },
  { statement: "Santos Dumont inventou o avião.", isCorrect: true, explanation: "Dumont fez o primeiro voo público em Paris em 1906.", category: "brazil" },
  { statement: "Machado de Assis fundou a Academia Brasileira de Letras.", isCorrect: true, explanation: "A ABL foi fundada em 1897, com Machado como primeiro presidente.", category: "brazil" },
  { statement: "Oscar Niemeyer projetou Brasília.", isCorrect: true, explanation: "Niemeyer foi o principal arquiteto da nova capital.", category: "brazil" },
  { statement: "Carmen Miranda foi uma cantora portuguesa naturalizada brasileira.", isCorrect: true, explanation: "Nasceu em Portugal mas fez carreira no Brasil e EUA.", category: "brazil" },
  { statement: "A Lei do Ventre Livre foi assinada em 1871.", isCorrect: true, explanation: "A lei declarava livres os filhos de escravos nascidos a partir daquela data.", category: "brazil" },
  { statement: "A Lei dos Sexagenários foi assinada em 1885.", isCorrect: true, explanation: "Libertava escravos com mais de 60 anos.", category: "brazil" },
  { statement: "O ciclo do café foi importante no século XIX.", isCorrect: true, explanation: "O café foi o principal produto de exportação do Brasil.", category: "brazil" },
  { statement: "O ciclo da borracha ocorreu na Amazônia.", isCorrect: true, explanation: "A borracha trouxe riqueza para a região no fim do século XIX.", category: "brazil" },
  { statement: "A imigração italiana foi forte no final do século XIX.", isCorrect: true, explanation: "Milhões de italianos imigraram para trabalhar nas fazendas de café.", category: "brazil" },
  { statement: "Zumbi dos Palmares morreu em 1695.", isCorrect: true, explanation: "Zumbi foi morto em 20 de novembro, hoje Dia da Consciência Negra.", category: "brazil" },
  { statement: "O Quilombo dos Palmares ficava em Alagoas.", isCorrect: true, explanation: "O maior quilombo brasileiro existiu por quase 100 anos.", category: "brazil" },
  { statement: "A capital foi transferida do Rio para Brasília em 1960.", isCorrect: true, explanation: "JK inaugurou Brasília em 21 de abril de 1960.", category: "brazil" },
  { statement: "O Brasil foi sede da Copa do Mundo em 2014.", isCorrect: true, explanation: "A Copa foi realizada no Brasil, com a Alemanha campeã.", category: "brazil" },
  { statement: "O Brasil sediou as Olimpíadas em 2016.", isCorrect: true, explanation: "Os Jogos Olímpicos foram realizados no Rio de Janeiro.", category: "brazil" },
  { statement: "Lula foi presidente do Brasil.", isCorrect: true, explanation: "Lula governou de 2003 a 2010.", category: "brazil" },
  { statement: "Dilma Rousseff foi a primeira mulher presidente do Brasil.", isCorrect: true, explanation: "Dilma governou de 2011 a 2016.", category: "brazil" },
  { statement: "O impeachment de Dilma foi em 2016.", isCorrect: true, explanation: "Dilma foi afastada em agosto de 2016.", category: "brazil" },
  { statement: "A pandemia de COVID-19 chegou ao Brasil em 2020.", isCorrect: true, explanation: "O primeiro caso foi confirmado em fevereiro de 2020.", category: "brazil" },
  { statement: "O Museu Nacional foi destruído por incêndio em 2018.", isCorrect: true, explanation: "O incêndio destruiu 90% do acervo do museu no Rio.", category: "brazil" },
  { statement: "A tragédia de Brumadinho foi em 2019.", isCorrect: true, explanation: "O rompimento da barragem matou 270 pessoas.", category: "brazil" },
  { statement: "Ayrton Senna morreu em 1994.", isCorrect: true, explanation: "O piloto morreu em acidente no GP de San Marino.", category: "brazil" },
  { statement: "O Brasil tem o maior rio em volume de água do mundo.", isCorrect: true, explanation: "O Rio Amazonas é o maior rio do mundo em volume.", category: "brazil" },
  
  // Mundial (60 questões)
  { statement: "As Pirâmides do Egito foram construídas pelos romanos.", isCorrect: false, explanation: "As pirâmides foram construídas pelos egípcios há mais de 4.500 anos.", category: "world" },
  { statement: "A Revolução Francesa começou em 1789.", isCorrect: true, explanation: "A queda da Bastilha em 14 de julho de 1789 marca o início.", category: "world" },
  { statement: "A Primeira Guerra Mundial começou em 1914.", isCorrect: true, explanation: "A guerra começou em 1914 após o assassinato de Franz Ferdinand.", category: "world" },
  { statement: "A Segunda Guerra Mundial terminou em 1945.", isCorrect: true, explanation: "A guerra terminou com a rendição do Japão em setembro de 1945.", category: "world" },
  { statement: "O Império Romano caiu no ano 476 d.C.", isCorrect: true, explanation: "O Império Romano do Ocidente caiu em 476 d.C.", category: "world" },
  { statement: "A Guerra Fria foi um conflito armado direto entre EUA e URSS.", isCorrect: false, explanation: "A Guerra Fria foi um conflito ideológico sem confronto direto.", category: "world" },
  { statement: "Cristóvão Colombo chegou à América em 1492.", isCorrect: true, explanation: "Colombo chegou às Américas em 12 de outubro de 1492.", category: "world" },
  { statement: "A Revolução Industrial começou na França.", isCorrect: false, explanation: "A Revolução Industrial começou na Inglaterra no século XVIII.", category: "world" },
  { statement: "Napoleão Bonaparte foi imperador da França.", isCorrect: true, explanation: "Napoleão governou a França de 1804 a 1814/1815.", category: "world" },
  { statement: "A Grécia Antiga foi o berço da democracia.", isCorrect: true, explanation: "Atenas desenvolveu a democracia no século V a.C.", category: "world" },
  { statement: "Alexandre, o Grande, conquistou a Índia.", isCorrect: false, explanation: "Alexandre chegou à Índia mas não a conquistou completamente.", category: "world" },
  { statement: "O Renascimento começou na Itália.", isCorrect: true, explanation: "O Renascimento surgiu na Itália no século XIV.", category: "world" },
  { statement: "A Reforma Protestante foi iniciada por Martinho Lutero.", isCorrect: true, explanation: "Lutero publicou as 95 teses em 1517.", category: "world" },
  { statement: "A Revolução Russa ocorreu em 1917.", isCorrect: true, explanation: "A Revolução Bolchevique derrubou o czar em 1917.", category: "world" },
  { statement: "Mahatma Gandhi liderou a independência da Índia.", isCorrect: true, explanation: "Gandhi liderou o movimento de independência até 1947.", category: "world" },
  { statement: "Nelson Mandela foi presidente da África do Sul.", isCorrect: true, explanation: "Mandela governou de 1994 a 1999.", category: "world" },
  { statement: "A China se tornou comunista em 1959.", isCorrect: false, explanation: "A China se tornou comunista em 1949 com Mao Zedong.", category: "world" },
  { statement: "A União Soviética foi dissolvida em 1991.", isCorrect: true, explanation: "A URSS deixou de existir em 26 de dezembro de 1991.", category: "world" },
  { statement: "O Holocausto ocorreu durante a Primeira Guerra Mundial.", isCorrect: false, explanation: "O Holocausto ocorreu durante a Segunda Guerra Mundial.", category: "world" },
  { statement: "A Grande Muralha da China foi construída para defesa.", isCorrect: true, explanation: "Foi construída para proteger contra invasões nômades.", category: "world" },
  { statement: "Cleópatra foi uma rainha do Egito.", isCorrect: true, explanation: "Cleópatra VII foi a última faraó do Egito Antigo.", category: "world" },
  { statement: "Júlio César foi assassinado em Roma.", isCorrect: true, explanation: "César foi morto em 15 de março de 44 a.C.", category: "world" },
  { statement: "O Coliseu foi construído em Atenas.", isCorrect: false, explanation: "O Coliseu foi construído em Roma.", category: "world" },
  { statement: "Sócrates foi um filósofo grego.", isCorrect: true, explanation: "Sócrates é considerado o pai da filosofia ocidental.", category: "world" },
  { statement: "Leonardo da Vinci pintou a Mona Lisa.", isCorrect: true, explanation: "A obra-prima foi pintada no início do século XVI.", category: "world" },
  { statement: "Michelangelo pintou o teto da Capela Sistina.", isCorrect: true, explanation: "A obra foi concluída entre 1508 e 1512.", category: "world" },
  { statement: "Isaac Newton descobriu a lei da gravidade.", isCorrect: true, explanation: "Newton formulou a lei da gravitação universal no século XVII.", category: "world" },
  { statement: "Albert Einstein criou a teoria da relatividade.", isCorrect: true, explanation: "Einstein publicou a teoria em 1905 e 1915.", category: "world" },
  { statement: "Marie Curie ganhou dois prêmios Nobel.", isCorrect: true, explanation: "Ela ganhou em Física (1903) e Química (1911).", category: "world" },
  { statement: "Charles Darwin criou a teoria da evolução.", isCorrect: true, explanation: "Darwin publicou 'A Origem das Espécies' em 1859.", category: "world" },
  { statement: "A Peste Negra devastou a Europa no século XIV.", isCorrect: true, explanation: "A epidemia matou cerca de um terço da população europeia.", category: "world" },
  { statement: "As Cruzadas foram expedições militares cristãs.", isCorrect: true, explanation: "As Cruzadas ocorreram entre os séculos XI e XIII.", category: "world" },
  { statement: "Marco Polo viajou à China.", isCorrect: true, explanation: "Marco Polo visitou a corte de Kublai Khan no século XIII.", category: "world" },
  { statement: "Vasco da Gama chegou à Índia por mar.", isCorrect: true, explanation: "Vasco da Gama chegou à Índia em 1498.", category: "world" },
  { statement: "Fernão de Magalhães deu a primeira volta ao mundo.", isCorrect: true, explanation: "A expedição de Magalhães circum-navegou o globo (1519-1522).", category: "world" },
  { statement: "A Revolução Americana foi em 1776.", isCorrect: true, explanation: "A Declaração de Independência dos EUA foi em 4 de julho de 1776.", category: "world" },
  { statement: "Abraham Lincoln aboliu a escravidão nos EUA.", isCorrect: true, explanation: "A 13ª Emenda aboliu a escravidão em 1865.", category: "world" },
  { statement: "Martin Luther King liderou o movimento pelos direitos civis.", isCorrect: true, explanation: "King liderou a luta contra a segregação racial nos EUA.", category: "world" },
  { statement: "O Japão atacou Pearl Harbor em 1941.", isCorrect: true, explanation: "O ataque em 7 de dezembro levou os EUA à Segunda Guerra.", category: "world" },
  { statement: "A Guerra do Vietnã envolveu os Estados Unidos.", isCorrect: true, explanation: "Os EUA combateram no Vietnã de 1955 a 1975.", category: "world" },
  { statement: "A Guerra da Coreia terminou em 1953.", isCorrect: true, explanation: "O armistício foi assinado em 1953, mas não houve tratado de paz.", category: "world" },
  { statement: "Fidel Castro liderou a Revolução Cubana.", isCorrect: true, explanation: "Castro chegou ao poder em Cuba em 1959.", category: "world" },
  { statement: "O Apartheid foi um regime de segregação na África do Sul.", isCorrect: true, explanation: "O Apartheid durou de 1948 a 1994.", category: "world" },
  { statement: "A União Europeia foi fundada em 1957.", isCorrect: false, explanation: "A CEE foi criada em 1957; a UE, em 1993.", category: "world" },
  { statement: "Winston Churchill foi primeiro-ministro britânico na Segunda Guerra.", isCorrect: true, explanation: "Churchill liderou a Grã-Bretanha de 1940 a 1945.", category: "world" },
  { statement: "Adolf Hitler era austríaco de nascimento.", isCorrect: true, explanation: "Hitler nasceu na Áustria em 1889.", category: "world" },
  { statement: "Benito Mussolini liderou a Itália fascista.", isCorrect: true, explanation: "Mussolini governou a Itália de 1922 a 1943.", category: "world" },
  { statement: "A Espanha teve uma guerra civil de 1936 a 1939.", isCorrect: true, explanation: "A guerra terminou com a vitória de Francisco Franco.", category: "world" },
  { statement: "A Índia conquistou independência em 1947.", isCorrect: true, explanation: "A Índia se tornou independente da Grã-Bretanha.", category: "world" },
  { statement: "O Canal de Suez foi inaugurado em 1869.", isCorrect: true, explanation: "O canal conecta o Mar Mediterrâneo ao Mar Vermelho.", category: "world" },
  { statement: "O Canal do Panamá foi concluído em 1914.", isCorrect: true, explanation: "O canal conecta os oceanos Atlântico e Pacífico.", category: "world" },
  { statement: "A Torre Eiffel foi construída em 1889.", isCorrect: true, explanation: "Foi construída para a Exposição Universal de Paris.", category: "world" },
  { statement: "A Estátua da Liberdade foi um presente da França.", isCorrect: true, explanation: "A estátua foi dada aos EUA em 1886.", category: "world" },
  { statement: "O Coliseu de Roma foi construído no século I.", isCorrect: true, explanation: "A construção foi concluída em 80 d.C.", category: "world" },
  { statement: "Machu Picchu foi construída pelos Incas.", isCorrect: true, explanation: "A cidade foi construída no século XV.", category: "world" },
  { statement: "A Revolução Chinesa foi liderada por Mao Zedong.", isCorrect: true, explanation: "Mao proclamou a República Popular da China em 1949.", category: "world" },
  { statement: "O Muro de Berlim dividiu a cidade por 28 anos.", isCorrect: true, explanation: "O muro existiu de 1961 a 1989.", category: "world" },
  { statement: "A Guerra do Golfo foi em 1991.", isCorrect: true, explanation: "A coalizão liderada pelos EUA libertou o Kuwait.", category: "world" },
  { statement: "A invasão do Iraque pelos EUA foi em 2003.", isCorrect: true, explanation: "Os EUA invadiram o Iraque em março de 2003.", category: "world" },
  { statement: "A Primavera Árabe começou em 2011.", isCorrect: true, explanation: "Uma onda de protestos varreu o mundo árabe.", category: "world" },
  
  // Datas (60 questões)
  { statement: "A queda do Muro de Berlim aconteceu em 1989.", isCorrect: true, explanation: "O Muro de Berlim caiu em 9 de novembro de 1989.", category: "dates" },
  { statement: "O homem pisou na Lua pela primeira vez em 1969.", isCorrect: true, explanation: "Neil Armstrong pisou na Lua em 20 de julho de 1969.", category: "dates" },
  { statement: "A Declaração Universal dos Direitos Humanos foi em 1948.", isCorrect: true, explanation: "Foi adotada pela ONU em 10 de dezembro de 1948.", category: "dates" },
  { statement: "A ONU foi fundada em 1955.", isCorrect: false, explanation: "A ONU foi fundada em 24 de outubro de 1945.", category: "dates" },
  { statement: "O ataque às Torres Gêmeas ocorreu em 2001.", isCorrect: true, explanation: "Os ataques de 11 de setembro aconteceram em 2001.", category: "dates" },
  { statement: "A internet foi criada na década de 1960.", isCorrect: true, explanation: "A ARPANET, precursora da internet, surgiu em 1969.", category: "dates" },
  { statement: "O primeiro computador foi inventado em 1930.", isCorrect: false, explanation: "O ENIAC, primeiro computador, foi criado em 1946.", category: "dates" },
  { statement: "A bomba atômica foi lançada em Hiroshima em 1945.", isCorrect: true, explanation: "A bomba foi lançada em 6 de agosto de 1945.", category: "dates" },
  { statement: "A Primeira Guerra Mundial terminou em 1918.", isCorrect: true, explanation: "O armistício foi assinado em 11 de novembro de 1918.", category: "dates" },
  { statement: "O Euro foi introduzido em 2002.", isCorrect: false, explanation: "O Euro foi introduzido em 1 de janeiro de 1999 (notas em 2002).", category: "dates" },
  { statement: "A Copa do Mundo foi criada em 1930.", isCorrect: true, explanation: "A primeira Copa foi no Uruguai em 1930.", category: "dates" },
  { statement: "Os Jogos Olímpicos modernos começaram em 1896.", isCorrect: true, explanation: "A primeira Olimpíada moderna foi em Atenas, 1896.", category: "dates" },
  { statement: "O iPhone foi lançado em 2007.", isCorrect: true, explanation: "Steve Jobs apresentou o iPhone em 9 de janeiro de 2007.", category: "dates" },
  { statement: "O Facebook foi criado em 2004.", isCorrect: true, explanation: "Mark Zuckerberg lançou o Facebook em 4 de fevereiro de 2004.", category: "dates" },
  { statement: "A Wikipédia foi lançada em 2001.", isCorrect: true, explanation: "A Wikipédia foi lançada em 15 de janeiro de 2001.", category: "dates" },
  { statement: "O Google foi fundado em 1998.", isCorrect: true, explanation: "Larry Page e Sergey Brin fundaram o Google em 1998.", category: "dates" },
  { statement: "A clonagem da ovelha Dolly foi em 1996.", isCorrect: true, explanation: "Dolly nasceu em 5 de julho de 1996.", category: "dates" },
  { statement: "O acidente nuclear de Chernobyl foi em 1986.", isCorrect: true, explanation: "O desastre ocorreu em 26 de abril de 1986.", category: "dates" },
  { statement: "O Titanic afundou em 1912.", isCorrect: true, explanation: "O Titanic afundou em 15 de abril de 1912.", category: "dates" },
  { statement: "A penicilina foi descoberta em 1928.", isCorrect: true, explanation: "Alexander Fleming descobriu a penicilina em 1928.", category: "dates" },
  { statement: "O YouTube foi lançado em 2005.", isCorrect: true, explanation: "O primeiro vídeo foi publicado em abril de 2005.", category: "dates" },
  { statement: "O Twitter foi criado em 2006.", isCorrect: true, explanation: "Jack Dorsey lançou o Twitter em março de 2006.", category: "dates" },
  { statement: "O Instagram foi lançado em 2010.", isCorrect: true, explanation: "O Instagram foi lançado em outubro de 2010.", category: "dates" },
  { statement: "O WhatsApp foi criado em 2009.", isCorrect: true, explanation: "Jan Koum e Brian Acton fundaram o WhatsApp.", category: "dates" },
  { statement: "A Netflix começou como serviço de streaming em 2007.", isCorrect: true, explanation: "A Netflix lançou seu serviço de streaming nesse ano.", category: "dates" },
  { statement: "O primeiro e-mail foi enviado em 1971.", isCorrect: true, explanation: "Ray Tomlinson enviou o primeiro e-mail.", category: "dates" },
  { statement: "O primeiro celular foi criado em 1973.", isCorrect: true, explanation: "Martin Cooper fez a primeira ligação de celular.", category: "dates" },
  { statement: "O Windows foi lançado em 1985.", isCorrect: true, explanation: "A Microsoft lançou o Windows 1.0 em novembro de 1985.", category: "dates" },
  { statement: "O Macintosh foi lançado em 1984.", isCorrect: true, explanation: "A Apple lançou o primeiro Macintosh em janeiro de 1984.", category: "dates" },
  { statement: "O iPod foi lançado em 2001.", isCorrect: true, explanation: "A Apple apresentou o iPod em outubro de 2001.", category: "dates" },
  { statement: "O GPS foi disponibilizado para uso civil em 2000.", isCorrect: true, explanation: "A precisão total foi liberada em maio de 2000.", category: "dates" },
  { statement: "O Hubble foi lançado em 1990.", isCorrect: true, explanation: "O telescópio espacial foi lançado em abril de 1990.", category: "dates" },
  { statement: "A Estação Espacial Internacional foi lançada em 1998.", isCorrect: true, explanation: "O primeiro módulo foi lançado em novembro de 1998.", category: "dates" },
  { statement: "O primeiro satélite artificial foi lançado em 1957.", isCorrect: true, explanation: "O Sputnik foi lançado pela URSS em outubro de 1957.", category: "dates" },
  { statement: "Yuri Gagarin foi ao espaço em 1961.", isCorrect: true, explanation: "Gagarin foi o primeiro humano no espaço em abril de 1961.", category: "dates" },
  { statement: "O acidente de Fukushima foi em 2011.", isCorrect: true, explanation: "O terremoto e tsunami causaram o acidente nuclear.", category: "dates" },
  { statement: "O terremoto do Haiti foi em 2010.", isCorrect: true, explanation: "O terremoto devastador ocorreu em janeiro de 2010.", category: "dates" },
  { statement: "O tsunami na Ásia foi em 2004.", isCorrect: true, explanation: "O tsunami do Oceano Índico matou mais de 230 mil pessoas.", category: "dates" },
  { statement: "A crise financeira global foi em 2008.", isCorrect: true, explanation: "A crise começou com a falência do Lehman Brothers.", category: "dates" },
  { statement: "O Brexit foi votado em 2016.", isCorrect: true, explanation: "O Reino Unido votou para sair da UE em junho de 2016.", category: "dates" },
  { statement: "A pandemia de COVID-19 foi declarada em 2020.", isCorrect: true, explanation: "A OMS declarou pandemia em março de 2020.", category: "dates" },
  { statement: "O ChatGPT foi lançado em 2022.", isCorrect: true, explanation: "A OpenAI lançou o ChatGPT em novembro de 2022.", category: "dates" },
  { statement: "O telescópio James Webb foi lançado em 2021.", isCorrect: true, explanation: "O JWST foi lançado em dezembro de 2021.", category: "dates" },
  { statement: "A Copa do Mundo no Qatar foi em 2022.", isCorrect: true, explanation: "A Argentina foi campeã da Copa de 2022.", category: "dates" },
  { statement: "O Brasil conquistou o tetra em 1994.", isCorrect: true, explanation: "O Brasil venceu a Copa nos Estados Unidos.", category: "dates" },
  { statement: "O Brasil conquistou o penta em 2002.", isCorrect: true, explanation: "O Brasil venceu a Copa na Coreia do Sul/Japão.", category: "dates" },
  { statement: "A primeira partida de futebol televisionada foi em 1937.", isCorrect: true, explanation: "A BBC transmitiu uma partida na Inglaterra.", category: "dates" },
  { statement: "O primeiro filme sonoro foi em 1927.", isCorrect: true, explanation: "'O Cantor de Jazz' foi o primeiro filme com diálogos.", category: "dates" },
  { statement: "A primeira fotografia foi tirada em 1826.", isCorrect: true, explanation: "Joseph Niépce tirou a primeira foto permanente.", category: "dates" },
  { statement: "O primeiro avião voou em 1903.", isCorrect: true, explanation: "Os irmãos Wright voaram em Kitty Hawk.", category: "dates" },
  { statement: "O primeiro automóvel foi inventado em 1886.", isCorrect: true, explanation: "Karl Benz patenteou o primeiro automóvel.", category: "dates" },
  { statement: "A lâmpada elétrica foi inventada em 1879.", isCorrect: true, explanation: "Thomas Edison patenteou a lâmpada incandescente.", category: "dates" },
  { statement: "O telefone foi inventado em 1876.", isCorrect: true, explanation: "Alexander Graham Bell patenteou o telefone.", category: "dates" },
  { statement: "A máquina de escrever foi inventada em 1868.", isCorrect: true, explanation: "Christopher Sholes inventou a máquina de escrever.", category: "dates" },
  { statement: "O rádio foi inventado por Marconi em 1895.", isCorrect: true, explanation: "Guglielmo Marconi desenvolveu o rádio.", category: "dates" },
  { statement: "A televisão foi inventada em 1927.", isCorrect: true, explanation: "Philo Farnsworth demonstrou a TV eletrônica.", category: "dates" },
  { statement: "O DNA foi descoberto em 1953.", isCorrect: true, explanation: "Watson e Crick descobriram a estrutura do DNA.", category: "dates" },
  { statement: "A vacina contra poliomielite foi criada em 1955.", isCorrect: true, explanation: "Jonas Salk desenvolveu a primeira vacina.", category: "dates" },
  { statement: "O primeiro transplante de coração foi em 1967.", isCorrect: true, explanation: "Christiaan Barnard realizou a cirurgia na África do Sul.", category: "dates" },
  { statement: "Louise Brown, primeiro bebê de proveta, nasceu em 1978.", isCorrect: true, explanation: "Foi o primeiro bebê nascido por fertilização in vitro.", category: "dates" },
];

export function HistoryGame({ topic, onExit }: HistoryGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  
  const createResult = useCreateResult();

  const generateQuestion = (): Question => {
    const filtered = topic === 'random' 
      ? questions 
      : questions.filter(q => q.category === topic);
    
    // Map filtered questions to their original indices
    const indexedFiltered = filtered.map(q => ({
      question: q,
      originalIndex: questions.indexOf(q)
    }));
    
    // Filter out already used questions
    const available = indexedFiltered.filter(item => !usedQuestions.has(item.originalIndex));
    const pool = available.length > 0 ? available : indexedFiltered;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    
    setUsedQuestions(prev => new Set([...Array.from(prev), selected.originalIndex]));
    
    return selected.question;
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  const handleAnswer = (answer: boolean) => {
    if (feedback !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      finishGame();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(generateQuestion());
    }
  };

  const finishGame = () => {
    setIsGameFinished(true);
    if (score >= 7) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    createResult.mutate({
      subject: 'history',
      topic: topic,
      score: score,
      totalQuestions: TOTAL_QUESTIONS
    });
  };

  if (isGameFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold">Fim de Jogo!</h2>
        <p className="text-xl text-muted-foreground">Sua pontuação</p>
        <div className="text-6xl font-black text-orange-500">{score}/{TOTAL_QUESTIONS}</div>

        <div className="flex gap-4">
          <Button onClick={onExit} variant="outline" size="lg" className="rounded-full px-8">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 bg-orange-500 hover:bg-orange-600">
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-orange-500"/></div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <Home className="w-4 h-4 mr-2" /> Sair
        </Button>
        <div className="text-right">
          <span className="text-sm font-bold text-muted-foreground">Pergunta {currentQuestionIndex + 1} de {TOTAL_QUESTIONS}</span>
          <br />
          <span className="text-xs text-muted-foreground">Pontuação: {score}</span>
        </div>
      </div>

      <Progress value={(currentQuestionIndex / TOTAL_QUESTIONS) * 100} className="h-3 mb-8" />

      <Card className="border-0 shadow-2xl bg-white/50 backdrop-blur-xl p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4">Esta afirmação está correta ou incorreta?</p>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-border mb-8">
              <p className="text-xl md:text-2xl font-medium text-center">
                "{currentQuestion.statement}"
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={feedback !== null}
                className={`p-6 text-xl font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                  feedback !== null
                    ? currentQuestion.isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : selectedAnswer === true
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    : 'bg-white border-border hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <Check className="w-6 h-6" /> Certo
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={feedback !== null}
                className={`p-6 text-xl font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                  feedback !== null
                    ? !currentQuestion.isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : selectedAnswer === false
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    : 'bg-white border-border hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <X className="w-6 h-6" /> Errado
              </button>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  {feedback === 'correct' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <span className={`text-2xl font-bold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                    {feedback === 'correct' ? "Correto!" : "Ops!"}
                  </span>
                </div>
                
                <p className="text-lg text-muted-foreground mb-4">
                  {currentQuestion.explanation}
                </p>

                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
                  Próxima Pergunta <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
