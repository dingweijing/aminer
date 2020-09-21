import React, { useState, useEffect } from 'react';
import { page, connect, Link } from 'acore';
import { classNamenames } from 'utils';
import { FM, formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
import styles from './index.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
}

const Data: React.FC<Proptypes> = props => {
  return (
    <Layout
      className="newTopic"
      rootclassName="shortNameIndex"
      pageUniqueTitle={formatMessage({
        id: `aminer.topic.pageTitle`,
      })}
      pageDesc={}
      pageKeywords={formatMessage({
        id: `aminer.topic.pageKeywords`,
      })}
    >
      <div className={styles.data} style={{ margin: '0px', minHeight: '100px' }}>
        <div className="container dataset">
          <div className="tab-pane fade active in">
            <h3>AMiner Dataset</h3>
            <table
              className="table table-bordered table-striped"
              style={{ borderCollapse: 'collapse' }}
            >
              {/* <colgroup span="1">
                <col className="span1" span="1" />
                <col className="span7" span="1" />
              </colgroup> */}
              <thead style={{ backgroundColor: '#42428' }}>
                <tr style={{ background: 'rgba(66, 141, 199, 0.95) !important' }}>
                  <th>Name</th>
                  <th>Node</th>
                  <th>Edge</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {datasets && datasets.data &&
                  datasets.data.map(data => {
                    return (
                      <tr key={data.SN}>
                        <td>
                          <a target="_blank">{data.name}</a>
                        </td>
                        <td>{data.node}</td>
                        <td>{data.edge}</td>
                        <td>{data.Des}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <a ui-sref="dataExternal">External dataset</a>
          <div className="inner-results" id="Covid">
            <div className="headline">
              <h3>
                <strong>COVID-19 Open Datasets &nbsp;</strong>
              </h3>
              <a href="https://www.aminer.cn/data-covid19/" target="_blank">
                [Download]
              </a>
            </div>
            <p>
              For fighting against COVID-19 pandemic, open and comprehensive big data may help
              researchers, officials, medical staffs and crowds to understand the virus and pandemic
              more. The team have been collecting all kinds of open datasets about COVID-19 and
              keeps updating everyday. The datasets include pandemic, research, knowledge graph,
              media reports and so on.
            </p>
          </div>
          <div className="inner-results" id="Citation">
            <div className="headline">
              <h3>
                <strong>Citation &nbsp;</strong>
              </h3>
              <a href="/citation">[Download]</a>
            </div>
            <p>
              The data set is designed for research purpose only. The citation data is extracted
              from DBLP, ACM, and other sources. The first version contains 629,814 papers and
              632,752 citations. Each paper is associated with abstract, authors, year, venue, and
              title.
            </p>
            <p>
              The data set can be used for clustering with network and side information, studying
              influence in the citation network, finding the most influential papers, topic modeling
              analysis, etc.
            </p>
            <p>A larger version will be released soon.</p>
          </div>
          <div className="inner-results" id="Academic-Social-Network">
            <div className="headline">
              <h3>
                <strong>Academic Social Network &nbsp;</strong>
              </h3>
              <a href="/aminernetwork">[Download]</a>
            </div>
            <p>
              The content of this data includes paper information, paper citation, author
              information and author collaboration. 2,092,356 papers and 8,024,869 citations between
              them are saved in the file &nbsp;
              <a href="http://lfs.aminer.cn/lab-datasets/aminerdataset/AMiner-Paper.rar">
                AMiner-Paper.rar
              </a>
              &nbsp;; 1,712,433 authors are saved in the file &nbsp;
              <a href="http://lfs.aminer.cn/lab-datasets/aminerdataset/AMiner-Author.zip">
                AMiner-Author.zip
              </a>
              &nbsp;and 4,258,615 collaboration relationships are saved in the file &nbsp;
              <a href="http://lfs.aminer.cn/lab-datasets/aminerdataset/AMiner-Coauthor.zip">
                AMiner-Coauthor.zip
              </a>
              .
            </p>
          </div>
          <div className="inner-results" id="Advisor-advisee">
            <div className="headline">
              <h3>
                <strong>Advisor-advisee &nbsp;</strong>
              </h3>
              <a href="/socialtieacross">[Download]</a>
            </div>
            <p>
              This data set contains 6 different networks: Epinions, Slashdot, MobileU, MobileD,
              Coauthor, and Enron.
            </p>
            <ul>
              <li>
                <p>
                  <strong>Epinions &nbsp;</strong>is a network of product reviewers. Each user on
                  the site can post a review for any product and other users would rate the review
                  with trust or distrust. The data set consists of 131,828 users and 841,372
                  relationships, of which about 85.0% are trust relationships. 80,668 users received
                  at least one trust or distrust relationships.
                </p>
              </li>
              <li>
                <p>
                  <strong>Slashdot &nbsp;</strong>is a network of friends. Slashdot is a site for
                  sharing technology related news. The data set is comprised of 77,357 users and
                  516,575 relationships of which 76.7% are ``friend'' relationships.
                </p>
              </li>
              <li>
                <p>
                  <strong>MobileU &nbsp;</strong>is a network of mobile users. It consists of the
                  logs of calls, blue-tooth scanning data and cell tower IDs of 107 users during
                  about ten months. In total, the data contains 5,436 relationships.
                </p>
              </li>
              <li>
                <p>
                  <strong>MobileD &nbsp;</strong>is a relatively larger mobile network of
                  enterprise, where nodes are employees in a company and relationships are formed by
                  calls and short messages sent between each other during a few months. In total,
                  there are 232 users (50 managers and 182 ordinary employees) and 3,567
                  relationships (including calling and texting messages) between the users.
                </p>
              </li>
              <li>
                <p>
                  <strong>Coauthor &nbsp;</strong>is a network of authors. The data set, crawled
                  from Arnetminer.org, is comprised of 815,946 authors and 2,792,833 coauthor
                  relationships.
                </p>
              </li>
              <li>
                <p>
                  <strong>Enron &nbsp;</strong>is an email communication network. It consists of
                  136,329 emails between 151 Enron employees. Two types of relationships, i.e.,
                  manager-subordinate and colleague, were annotated between these employees. There
                  are in total 3,572 relationships, of which 133 are manager-subordinate
                  relationships.
                </p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Topic-coauthor">
            <div className="headline">
              <h3>
                <strong>Topic-coauthor &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/soinf/">[Download]</a>
            </div>
            <p>
              Co-author set consists of authors and coauthor relationship chosen from ArnetMiner.
              The dataset consists of 8 topics:
            </p>
            <ul>
              <li>
                <p>Topic 16: Data Mining / Association Rules</p>
              </li>
              <li>
                <p>Topic 107: Web Services</p>
              </li>
              <li>
                <p>Topic 131: Bayesian Networks / Belief function</p>
              </li>
              <li>
                <p>Topic 144: Web Mining / Information Fusion</p>
              </li>
              <li>
                <p>Topic 145: Semantic Web / Description Logics</p>
              </li>
              <li>
                <p>Topic 162: Machine Learning</p>
              </li>
              <li>
                <p>Topic 24: Database Systems / XML Data</p>
              </li>
              <li>
                <p>Topic 75: Information Retrieval.</p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Topic-paper-author">
            <div className="headline">
              <h3>
                <strong>Topic-paper-author &nbsp;</strong>
              </h3>
              <a href="/topic_paper_author">[Download]</a>
            </div>
            <p>The dataset is collected for the purpose of cross domain recommendation.</p>
            <ul>
              <li>
                {/* <strong>Data Mining: &nbsp; </strong> */}
                <p>
                  We use papers of the following data mining conferences: KDD, SDM, ICDM, WSDM and
                  PKDD as ground truth, which result in a network with 6,282 authors and 22,862
                  co-author relationships.
                </p>
              </li>
              <li>
                <p>
                  {/* <strong>Medical Informatics: &nbsp;</strong> */}
                  We include the following journals: Journal of the American Medical Informatics
                  Association, Journal of Biomedical Informatics, and Artificial Intelligence
                  in Medicine, IEEE Trans. Med. Imaging and IEEE Transactions on Information and
                  Technology in Biomedicine, from which we obtain a network of 9,150 authors and
                  31,851 coauthor relationships.
                </p>
              </li>
              <li>
                <p>
                  {/* <strong>Theory: &nbsp;</strong> */}
                  We include the following conferences, i.e., STOC, FOCS and SODA, from which we get
                  5,449 authors and 27,712 co-author relationships.
                </p>
              </li>
              <li>
                <p>
                  {/* <strong>Visualization: &nbsp;</strong> */}
                  We include the following conferences and journals, CVPR, ICCV, VAST, TVCG, IEEE
                  Visualization and Information Visualization. The obtained coauthor network is
                  comprised of 5,268 authors and 19,261 co-author relationships.
                </p>
              </li>
              <li>
                <p>
                  {/* <strong>Database: &nbsp;</strong> */}
                  We include the following conferences, i.e., SIGMOD, VLDB and ICDE. From those
                  conferences, we extract 7,590 authors and 37,592 co-author relationships.
                </p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Topic-citation">
            <div className="headline">
              <h3>
                <strong>Topic-citation &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/soinf/">[Download]</a>
            </div>
            <p>
              Citation network consists of paper and citation relationship chosen from ArnetMiner.
              The raw citation data consists of 2555 papers and 6101 citation relationship. The
              papers are mainly from 10 research fields:
            </p>
            <ul>
              <li>
                <p>Topic 16: Data Mining / Association Rules</p>
              </li>
              <li>
                <p>Topic 107: Web Services</p>
              </li>
              <li>
                <p>Topic 131: Bayesian Networks / Belief function</p>
              </li>
              <li>
                <p>Topic 144: Web Mining / Information Fusion</p>
              </li>
              <li>
                <p>Topic 145: Semantic Web / Description Logics</p>
              </li>
              <li>
                <p>Topic 162: Machine Learning</p>
              </li>
              <li>
                <p>Topic 24: Database Systems / XML Data</p>
              </li>
              <li>
                <p>Topic 75: Information Retrieval</p>
              </li>
              <li>
                <p>Topic 182: Pattern recognition / Image analysis</p>
              </li>
              <li>
                <p>Topic 199: Natural Language System / Statistical Machine Translation.</p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Kernel-Community">
            <div className="headline">
              <h3>
                <strong>Kernel community &nbsp;</strong>
              </h3>
              <a href="/KernelCommunity">[Download]</a>
            </div>
            <p>This data set includes three different real-world social networks:</p>
            <ul>
              <li>
                <p>
                  <strong>Coauthor &nbsp;</strong>(a co-authorship network with 822,415 nodes and
                  2,928,360 undirected edges). Each vertex represents an author and each edge
                  represents a co-author relation.
                </p>
              </li>
              <li>
                <p>
                  <strong>Wikipedia &nbsp;</strong>(a co-editorship network with 310,990 nodes and
                  10,780,996 undirected edges crawled from Wikipedia.org). Each vertex represents a
                  Wikipedia editor and each edge represents a co-editing relation.
                </p>
              </li>
              <li>
                <p>
                  <strong>Twitter &nbsp;</strong>(a following network with 465,023 nodes and 833,590
                  directed edges crawled from twitter.com). Each vertex represents a Twitter user
                  account and each edge represents a following relation. It is well-known that the
                  web displays a bow-tie structure [20], where 30% of the vertices are strongly
                  connected. We conduct a bow-tie analysis on the Twitter network, and discover that
                  only 8% (38,913) of the vertices are strongly connected.
                </p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Dynamic-coauthor">
            <div className="headline">
              <h3>
                <strong>Dynamic coauthor &nbsp;</strong>
              </h3>
              <a href="/dynamic_coauthor">[Download]</a>
            </div>
            <p>
              We construct the evolving coauthor network from ArnetMiner5. We collected 1,768,776
              publications published during 1986 to 2012 with 1,629,217 authors involved. We regard
              each year as a time stamp and there are 27 time stamps in total. At each time stamp,
              we create an edge between two authors if they have coauthored at least one paper in
              the most recent 3 years (including the current year). We convert the undirected
              coauthor network into directed network by regarding each undirected edge as two
              symmetric directed edges.
            </p>
          </div>
          <div className="inner-results" id="Research-Profiling">
            <div className="headline">
              <h3>
                <strong>Research profiling &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/profiling/">[Download]</a>
            </div>
            <p>
              We are developing extraction tools in ArnetMiner, a researcher social network system.
              The tool will be used to extract researcher profile from the Web page and outputs the
              extracted information into a researcher database.
            </p>
            <p>The data set and related documents are used for researcher profile extraction.</p>
          </div>
          <div className="inner-results" id="Citation-link-annotation">
            <div className="headline">
              <h3>
                <strong>Citation link annotation &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/ltg/">[Download]</a>
            </div>
            <p>
              The work intends to study how to quantify link semantics. Specifically, an ideal
              output of link semantics analysis is to provide users with the following information:
              (1) multiple topics discussed in each page; (2) semantics of a link between two pages;
              and (3) the influential strength of each link. With such an analysis, a user could
              easily trace the origins of an idea/technique, analyze the evolution and impact of a
              topic, filter the pages by certain categories of links, as well as zoom in and zoom
              out the linkage tracing graph with the degree of influence.
            </p>
            <p>
              This data set consists of publication papers chosen from ArnetMiner. original_data.rar
              contains both original papers, some contains the whole content, others only contain
              the abstract, and annotate_data.txt is the output of the annotation tool.
            </p>
          </div>
          <div className="inner-results" id="Expert-Finding">
            <div className="headline">
              <h3>
                <strong>Expert Finding &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/expertfinding/#expert-list">[Download]</a>
            </div>
            <p>
              We have collected topics and their related people lists from as many sources as
              possible. We randomly chose 13 topics and created 13 people lists. The data sets were
              used as the “golden metric” for expert finding. They were also used to create the test
              sets for association search. The following table shows the 13 topics and statistics of
              people we have collected. In the 13 topics, OA and SW are from PC members of the
              related conferences or workshops. DM is from a list of data mining people organized by
              kmining.com. IE is from a list of information extraction researchers that were
              collected by Muslea. BS and SVM are from their official web sites, respectively. PL,
              IA, ML, and NLP are from a page organized by Russell and Norvig, which links to 849
              pages around the web with information on Artificial Intelligence.
            </p>
          </div>
          <div className="inner-results" id="Association-Search">
            <div className="headline">
              <h3>
                <strong>Association Search &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/lab-datasets/expertfinding/#association-search">
                [Download]
              </a>
            </div>
            <p>
              To evaluate the effectiveness of our proposed association search approach, we created
              8 test sets. Each of the person pair contains a source person (including his name and
              id) and a target person (including his name and id). The test sets were created as
              follows. We randomly selected 1,000 person pairs from the researcher network and
              create the first test set.
            </p>
            <p>
              We use the above people lists to create the other 8 test sets. We created four test
              sets by randomly selecting person pairs from SW, DM, and IE respectively. With the
              three test sets, we are aimed at testing association search between persons from the
              same research community. We created the other five test sets by selecting persons from
              different research fields.
            </p>
          </div>
          <div className="inner-results" id="Topic-model-results">
            <div className="headline">
              <h3>
                <strong>Topic model results for Arnetminer dataset &nbsp;</strong>
              </h3>
              <a href="/ArnetMiner">[Download]</a>
            </div>
            <ul>
              <li>
                <p>
                  <strong>Aminer Author Name and ID</strong>
                </p>
                <p>
                  It consists mapping between name and id of authors in Arnetminer. The data is form
                  as a 2 column list. The first column is Arnetminer id and the second column is
                  Author name.
                </p>
              </li>
              <li>
                <p>
                  <strong>Aminer Topic Top 5000 Publications and Authors</strong>
                </p>
                <p>
                  It consists the top 5000 publication of each topics in Arnetminer. The data is
                  formed as 3 xml files. Each consists data of topics, publications and authors
                  respectively.
                </p>
              </li>
              <li>
                <p>
                  <strong>ACTMaps Author Topic</strong>
                </p>
                <p>
                  It consists the topic distribution given author. The data is organized into 733602
                  rows, each for an author. For each row, it consists columns separated by a blank
                  space. Each column is the topic id and weight separated by a ":"
                </p>
              </li>
              <li>
                <p>
                  <strong>Aminer FOAF Data Set</strong>
                </p>
                <p>
                  It consists of the FOAF data of authors in arnetminer.org. The data is organized
                  in standard FOAF format.
                </p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Coauthor">
            <div className="headline">
              <h3>
                <strong>Coauthor &nbsp;</strong>
              </h3>
              <a href="/Panther">[Download]</a>
            </div>
            <p>This data set contains 5 files:</p>
            <ul>
              <li>
                <p>
                  <strong>AMiner-Author.zip</strong>
                </p>
                <p>This file saves the author information.</p>
              </li>
              <li>
                <p>
                  <strong>AMinerCoauthor.graph.zip</strong>
                </p>
                <p>
                  This file saves the collaboration network among the authors in the first file.
                </p>
              </li>
              <li>
                <p>
                  <strong>AMinerCoauthor.dict.zip</strong>
                </p>
                <p>
                  This file saves the mapping from the index in the first file to the ID in the
                  second file.
                </p>
              </li>
              <li>
                <p>
                  <strong>AMinerCoauthor.panther.zip</strong>
                </p>
                <p>
                  This file saves the top-50 similar authors and the corresponding similarities for
                  each author in the above AMiner coauthor network output by the method Panther. The
                  line number denotes the ID of the author whose similar authors are presented.
                </p>
              </li>
              <li>
                <p>
                  <strong>AMinerCoauthor.panther++.zip</strong>
                </p>
                <p>
                  This file saves the top-50 similar authors and the corresponding Euclidean
                  distances for each author in the above AMiner coauthor network output by the
                  method Panther++. The line number denotes the ID of the author whose similar
                  authors are presented.
                </p>
              </li>
            </ul>
          </div>
          <div className="inner-results" id="Disambiguation">
            <div className="headline">
              <h3>
                <strong>Disambiguation &nbsp;</strong>
              </h3>
              <a href="http://arnetminer.org/disambiguation">[Download]</a>
            </div>
            <p>
              This data set is used for studying name disambiguation in digital library. It contains
              110 author names and their disambiguation results (ground truth). Each author name
              corresponds to a raw file in the "raw-data" folder and an answer file (ground truth)
              in the "Answer" folder. (The simple version does not contain "citation",
              "co-affiliation-occur", "homepage". Refer to our ICDM 2011 paper for the definition of
              these features.)
            </p>
          </div>
          <div className="inner-results" id="Web-User-Profiling">
            <div className="headline">
              <h3>
                <strong>Web User Profiling</strong>
              </h3>
            </div>
            <p>
              Credit to the team leaded by Professor Jibing Gong and Haopeng Zhang from YSU (Yanshan
              University) for labeling some of the data.
            </p>
            <p>
              <strong>1. Email</strong>
            </p>
            <p>
              For Email extraction, we labeled a dataset of around 2000 people, for training and
              testing. The name list is selected randomly from &nbsp;
              <a href="https://www.aminer.cn/">AMiner</a>. For each person in this name list, we
              leveraged &nbsp;<a href="https://www.google.com/">Google</a>&nbsp; to search for and
              extract candidate email addresses. We used contact information in the Aminer system as
              most of the ground truths, and had some human experts (without knowledge about our
              classNameification model) to label and double-check the data.
            </p>
            <p>
              <strong>2. Gender</strong>
            </p>
            <p>
              For Gender inference, we offer a labeled xlsx file of around 2400 people from the
              &nbsp;<a href="https://www.aminer.cn/">AMiner</a>&nbsp; system, with fields including
              name, organization, position and homepage.
            </p>
          </div>
          <div className="inner-results" id="Career-Trajectory">
            <div className="headline">
              <h3>
                <strong>Career Trajectory &nbsp;</strong>
              </h3>
              <a href="https://www.aminer.cn/careermap">[Download] </a>
            </div>
            <p>
              We release the Aminer dataset for interested researchers. The dataset includes 57037
              persons and 42230 affiliations harvested from Aminer. We have tried some effort to
              disambiguate persons with the same name and eliminate multiple writings of the same
              address (There may still be noises). We also collect 722 curricula vitae from the
              Internet which can be treated as the real world ground truth.
            </p>
          </div>
          <div className="inner-results" id="Network-Integration">
            <div className="headline">
              <h3>
                <strong>Network Integration</strong>
              </h3>
            </div>
            <p>
              We have collected data from different social networking site. The dataset consists of
              two collections of social networks, where the networks within a collection are
              overlapped with each other (i.e. have users corresponding to the same real world
              person).
            </p>
            <p>
              <strong>SNS network collection</strong>
            </p>
            <p>
              The SNS data collection consists of five popular online social networking sites:
              Twitter, LiveJournal, Flickr, Last.fm, and MySpace.
            </p>
            <p>
              The group truth mapping of SNS network collections was originally collected by Perito
              el. al through Google Profiles service. Please contact the original owner to obtain
              the data. Here, we provide a subset of the data for evaluation.
            </p>
            <p>
              Twitter - Livejournal
              <br />
              Twitter - Flickr
              <br />
              Twitter - Lastfm
              <br />
              Twitter - MySpace
              <br />
              Livejournal - Flickr
              <br />
              Livejournal - Lastfm
              <br />
              Livejournal - MySpace
              <br />
              Filckr - Lastfm
              <br />
              Flickr - MySpace
              <br />
              Lastfm - MySpace
            </p>
            <p>
              <strong>Academia network collection</strong>
            </p>
            <p>
              The Academia data collection consists of three academic or professional social
              networks: ArnetMiner (AM), Linkedin and Videolectures.
            </p>
            <p>
              The ground truth for Academia dataset is obtained through a crowdsourcing service on
              ArnetMiner. On each researcher's ArnetMiner profile, users can fill in urls linking to
              the external accounts. This service has been running on-line for more than one year
              and more than 10,000 interlinks record has been collected. Here, we provide a subset
              of the data for evaluation.
            </p>
            <p>AMiner-Linkedin</p>
          </div>
          <div className="inner-results" id="Open-Academic-Graph">
            <div className="headline">
              <h3>
                <strong>Open Academic Graph</strong>
              </h3>
            </div>
            <p>
              This data set is generated by linking two large academic graphs &nbsp;
              <a href="https://academic.microsoft.com/">Microsoft Academic Graph &nbsp;(</a>strong
              MAG &nbsp; ) and &nbsp;<a href="https://www.aminer.cn/">AMiner.</a>
            </p>
            <p>
              The data set is used for research purpose only. This version includes 166,192,182
              papers from MAG and 154,771,162 papers from AMiner. We generated 64,639,608 linking
              (matching) relations between the two graphs. In the future, more linking results, like
              authors, will be published. It can be used as a unified large academic graph for
              studying citation network, paper content, and others, and can be also used to study
              integration of multiple academic graphs.
            </p>
          </div>
          <div className="inner-results" id="Name-Disambiguation">
            <div className="headline">
              <h3>
                <strong>Name Disambiguation</strong>
              </h3>
            </div>
            <p>
              Name ambiguity has long been viewed as a challenging problem in many applications,
              such as scientific literature management, people search, and social network analysis.
              When we search a person name in these systems, many documents (e.g., papers, webpages)
              containing that person’s name may be returned. Which documents are about the person we
              care about? Although much research has been conducted, the problem remains largely
              unsolved, especially with the rapid growth of the people information available on the
              Web.
            </p>
          </div>
          <div className="inner-results" id="Science-Knowledge-Graph">
            <div className="headline">
              <h3>
                <strong>Science Knowledge Graph</strong>
              </h3>
            </div>
            <p>
              SciKG is a rich knowledge graph designed for scientific purpose (currently including
              computer science (CS)), consisting of concepts, experts, and papers. The concepts and
              their relationships are extracted from &nbsp;
              <a href="http://dl.acm.org/ccs/ccs_flat.cfm#10002950">ACM &nbsp;</a>
              <a href="http://dl.acm.org/ccs/ccs_flat.cfm#10002950">
                computing classNameification system
              </a>
              , supplemented with the definition of each concept from, e.g., Wikipedia. We further
              use &nbsp;<a href="https://www.aminer.cn/">AMiner &nbsp;</a>to associate top ranked
              experts and most relevant papers to each concept. Each expert has position,
              affiliation, research interests and also the link connecting to AMiner (for further
              rich information if necessary) and each paper contains meta information such as title,
              authors, abstract, publication venue, and year.
            </p>
          </div>
          <div className="inner-results" id="Knowledge-Graph-for-AI">
            <div className="headline">
              <h3>
                <strong>Knowledge Graph for AI</strong>
              </h3>
            </div>
            <p>
              130,750 scholars, 343,746 scholarily articales, 229,937 specialties from 103
              conferences
            </p>
          </div>
          <div className="inner-results" id="AMiner-Knowledge-Graph">
            <div className="headline">
              <h3>
                <strong>AMiner Knowledge Graph</strong>
              </h3>
            </div>
            <p>
              <strong>AMiner &nbsp;</strong>
              <strong>Knowledge Graph &nbsp;</strong>is a structured entity network extracted from
              &nbsp;<a href="https://www.aminer.cn/">AMiner</a>. It is comprised of over 500,00
              entities and about 290,000,000 links among them. The knowledge graph can be used as a
              benchmark to study knowledge graph construction and also used as an external resource
              for search/recommendation.
            </p>
          </div>
          <div className="inner-results" id="AMiner-Knowledge-Graph-datamining">
            <div className="headline">
              <h3>
                <strong>Knowledge Graph for Data Mining &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/misc/KnowledgeGraph-DataMining-0105.docx">
                [Download]
              </a>
            </div>
            <p>二级节点23个，三级节点309个</p>
          </div>
          <div className="inner-results" id="AMiner-Knowledge-Graph-kg">
            <div className="headline">
              <h3>
                <strong>Knowledge Graph for Knowledge Graph &nbsp;</strong>
              </h3>
              <a href="https://lfs.aminer.cn/misc/KnowledgeGraph-kg.xlsx">[Download]</a>
            </div>
            <p>Knowledge Graph for Knowledge</p>
          </div>
          <div id="Top-10000-Scholars-Trajectories"></div>
          <div className="headline">
            <h3>
              <strong>Top 10000 Scholars' Trajectories &nbsp;</strong>
            </h3>
            <a href="https://lfs.aminer.cn/misc/top_10000_trajectories.zip">[Download]</a>
          </div>
          <p> Trajectories of 9992 experts with the greatest h-index in AMiner science 1978</p>
          <div id="Knowledge-Graph-for-Machine-Learning"></div>
          <div className="headline">
            <h3>
              <strong>Knowledge Graph for Machine Learning &nbsp;</strong>
            </h3>
            <a href="https://lfs.aminer.cn/misc/KnowledgeGraph-MarchineLearnng.xlsx">[Download]</a>
          </div>
          <p> Knowledge Graph for Machine Learning</p>
        </div>
      </div>
    </Layout>
  );
};

export default page(connect())(Data);
const datasets = {
  data: [
    {
      SN: 0,
      name: 'COVID-19 Open Datasets',
      id: 'Covid',
      node: '189 datasets',
      edge: '',
      Des: 'Provide comprehensive open datasets about COVID-19 all over the world',
    },
    {
      SN: 1,
      name: 'Citation',
      id: 'Citation',
      node: '1572277 papers',
      edge: '2084019 citation relationships',
      Des: 'Citation network',
    },
    {
      SN: 2,
      name: 'Academic Social Network',
      id: 'Academic-Social-Network',
      node: '2,092,356 papers/1,712,433 authors',
      edge: '8,024,869 citation relationships/4,258,615 coauthor relationships',
      Des: 'citation and coauthor networks',
    },
    {
      SN: 3,
      name: 'Advisor-advisee',
      id: 'Advisor-advisee',
      node: '4794 authors',
      edge: '2164 advisor-advisee,3932 coauthor relationships',
      Des: 'Advisor-advisee network',
    },
    {
      SN: 4,
      name: 'Topic-coauthor',
      id: 'Topic-coauthor',
      node: '640134 authors of 8 topics',
      edge: '1554643 coauthor relationships',
      Des: 'Topic based Coauthor network',
    },
    {
      SN: 5,
      name: 'Topic-paper-author',
      id: 'Topic-paper-author',
      node: '33739 authors of 5 topics',
      edge: '139278 coauthor relationships',
      Des: 'Created for cross domain recommendation',
    },
    {
      SN: 6,
      name: 'Topic-citation',
      id: 'Topic-citation',
      node: '2329760 papers',
      edge: '12710347 citations relationships',
      Des: 'Topic based citation network',
    },
    {
      SN: 7,
      name: 'Kernel Community',
      id: 'Kernel-Community',
      node: '8000 papers of 27 conferences',
      edge: '',
      Des: 'Created for community detection',
    },
    {
      SN: 8,
      name: 'Dynamic coauthor',
      id: 'Dynamic-coauthor',
      node: '1629217 authors',
      edge: '2623832 coauthor relationships',
      Des: 'An evolving coauthor network with 27 time stamps',
    },
    {
      SN: 9,
      name: 'Research Profiling',
      id: 'Research-Profiling',
      node: '898 files',
      edge: '',
      Des: 'Created for researcher profile extraction',
    },
    {
      SN: 10,
      name: 'Citation link annotation',
      id: 'Citation-link-annotation',
      node: '155 citation pairs',
      edge: '',
      Des: 'Created to study the semantics of the citation relationships',
    },
    {
      SN: 11,
      name: 'Expert Finding',
      id: 'Expert-Finding',
      node: '1781 experts of 13 topics',
      edge: '',
      Des: 'A benchmark for expert finding',
    },
    {
      SN: 12,
      name: 'Association Search',
      id: 'Association-Search',
      node: '8369 author pairs of 9 topics',
      edge: '',
      Des: 'Created for association search',
    },
    {
      SN: 13,
      name: 'Topic model results for Arnetminer dataset',
      id: 'Topic-model-results',
      node: 'Top 1000000 papers and authors of 200 topics',
      edge: '',
      Des: 'The results of ACT model on AMiner dataset',
    },
    {
      SN: 14,
      name: 'Coauthor',
      id: 'Coauthor',
      node: '1560640 authors',
      edge: '4258946 coauthor relationships',
      Des: 'Coauthor network',
    },
    {
      SN: 15,
      name: 'Disambiguation',
      id: 'Disambiguation',
      node: '110 authors and their affiliations/papers',
      edge: '',
      Des:
        '(a) 6,730 papers for 100 author names; (b) 1,085 Web pages for 12 person names; (c) 755 ambiguous entities appearing in 20 news pages.',
    },
    {
      SN: 16,
      name: 'Web User Profiling',
      id: 'Web-User-Profiling',
      node: 'emails of 2,000 people and gender of 2,400 people',
      edge: '',
      Des: 'Created for web use profiling',
    },
    {
      SN: 17,
      name: 'Career Trajectory',
      id: 'Career-Trajectory',
      node: '57,037 persons and 42,230 affiliations',
      edge: '',
      Des: 'Created for studying career trajectories of scholars',
    },
    {
      SN: 18,
      name: 'Network Integration',
      id: 'Network-Integration',
      node: 'two data collections: SNS and Academic',
      edge: '',
      Des: 'Created for network integration',
    },
    {
      SN: 19,
      name: 'Open Academic Graph',
      id: 'Open-Academic-Graph',
      node:
        '166,192,182 papers from MAG 154,771,162 papers from AMiner, and 64,639,608 linking (matching) relations',
      edge: '',
      Des: 'Created for studying the integration of multiple academic graphs',
    },
    {
      SN: 20,
      name: 'Name Disambiguation',
      id: 'Name-Disambiguation',
      node: '23,823 names and 83,980 persons',
      edge: '',
      Des: 'Created for studying author name disambiguation',
    },
    {
      SN: 21,
      name: 'Science Knowledge Graph',
      id: 'Science-Knowledge-Graph',
      node: '908 concepts, 206,240 experts and 512,698 publications',
      edge: '',
      Des: 'A knowledge graph consisting of concepts, experts, and papers in Computer Science',
    },
    {
      SN: 22,
      name: 'Knowledge Graph for AI',
      id: 'Knowledge-Graph-for-AI',
      node:
        '130,750 scholars, 343,746 scholarily articales, 229,937 specialties from 103 conferences',
      edge: '',
      Des: '',
    },
    {
      SN: 23,
      name: 'AMiner Knowledge Graph',
      id: 'AMiner-Knowledge-Graph',
      node: '100,000 tags, 318,406 scholars, 63,068 organizations and 23,709 venues',
      edge: '',
      Des: 'A structured entity network extracted from AMiner',
    },
    {
      SN: 24,
      name: 'Knowledge Graph for Data Mining',
      id: 'AMiner-Knowledge-Graph-datamining',
      node: '二级节点23个，三级节点309个',
      edge: '',
      Des: 'Knowledge Graph for Data Mining',
    },
    {
      SN: 25,
      name: 'Knowledge Graph for Knowledge Graph',
      id: 'AMiner-Knowledge-Graph-kg',
      node: '二级节点11个，三级节点212个',
      edge: '',
      Des: 'Knowledge Graph for Knowledge Graph',
    },
    {
      SN: 26,
      name: "Top 10000 Scholars' Trajectories",
      id: 'Top-10000-Scholars-Trajectories',
      node: '9992 experts with the greatest h-index in AMiner',
      edge: '',
      Des: 'Trajectories of 9992 experts with the greatest h-index in AMiner science 1978',
    },
    {
      SN: 27,
      name: 'Knowledge Graph for Machine Learning',
      id: 'Knowledge-Graph-for-Machine-Learning',
      node: '机器学习八级知识图谱',
      edge: '',
      Des: 'Knowledge Graph for Machine Learning',
    },
  ],
};
