import React from 'react';
import { component } from 'acore';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import styles from './index.less';

const JoinUs = props => {

  return (
		<Layout showHeader={true}>
			<div className={styles.joinUs}>
				<div className={styles.connect}>
					<h1><span>公司福利</span></h1>
					<div>
						<ul className={styles.welfare}>
							<li>
								<h3>
									清华技术背景</h3>
								<p>
									拥有清华大学团队十余年在知识智能方面的积累和人才优势，顶级学府带你前行</p>
							</li>
							<li>
								<h3>
									人工智能前沿行业</h3>
								<p>
									公司致力于打造可解释、鲁棒、安全可靠、具有推理能力的新一代认知引擎，用AI赋能科技创新</p>
							</li>
							<li>
								<h3>
									行业大牛同行</h3>
								<p>
									行业大牛同行:零距离与院士、专家、教授等人工领域科技大牛深入沟通，助力成长</p>
							</li>
						</ul>
						<ul className={styles.welfare}>
							<li>
								<h3>
									员工健康保障</h3>
								<p>
									五险一金全额缴、员工体检少不了</p>
							</li>
							<li>
								<h3>
									个人发展空间</h3>
								<p>
									更大的舞台给你展示的机会，参与公司核心业务，给你意想不到的晋升机制</p>
							</li>
							<li>
								<h3>
									团建游玩happy</h3>
								<p>
									除了工作，我们还有娱乐，爬山，骑行、长跑、徒步、桌游~~~更多活动等你来！</p>
							</li>
						</ul>
					</div>
				</div>

				<div className={styles.connect}>
					<h1><span>联系我们</span></h1>
					<div><span className={styles.title}>投递简历：</span> <span>hr@aminer.cn</span></div>
					<div><span className={styles.title}>联系方式：</span> <span>010-82152508&nbsp; &nbsp;&nbsp;</span></div>
					<div><span className={styles.title}>工作地点：</span> <span>北京市海淀区清华科技园科建大厦</span></div>
				</div>

				<div className={styles.join}>
					<h1><span>加入我们</span></h1>
					<div>
						<div className={styles.join_us}>
							<div className={styles.join_title}>1.AI 算法工程师</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1. 负责内容推荐、文本挖掘、用户模型建设等；</div>
									<div>
										2. 优化搜索推荐系统算法；</div>
									<div>
										3. 基于大数据的知识抽取、挖掘、融合和可视化等算法研究；</div>
									<div>
										4. 算法和功能模块代码开发、后端算法 API 开发、测试、技术文档编写。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										<div>
											1. 本科及以上学历，计算机、通信等相关专业；</div>
										<div>
											2. 具有 3 年以上工作经验；</div>
										<div>
											3. 有扎实的编程能力，掌握至少一门后端编程语言（Python/Go/Java等）；</div>
										<div>
											4. 对操作系统、数据结构和算法有较为深刻的理解</div>
									</div>
									<div>
										&nbsp;</div>
								</div>
							</div>
						</div>

						<div className={styles.join_us}>
							<div className={styles.join_title}>2.前端工程师</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.基于 HTML5/CSS/JavaScript 等技术的 Web 前端系统开发、测试工作；</div>
									<div>
										2.与后端工程师协作，高效完成产品的数据交互、动态信息展现；</div>
									<div>
										3.持续的优化前端体验和页面响应速度，开发公共组件，新技术的调研使用。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										1. 精通 html/css/javascript（es5，es6），掌握基础算法，有 web 性能分析与调优能力；</div>
									<div>
										2. 熟悉 react 、vue 等框架及相关工具；</div>
									<div>
										3. 熟悉 Git；</div>
									<div>
										4. 善于团队协作、交流沟通。
										<br/>
										<span className={styles.add_point}><strong>加分项：</strong></span>
										<br/>
										<span>
											1. 熟悉 python,nodejs,java,go 等任一一门后端语言；
											<br/>
											2. 有 github 开源项目，或者参与过大型开源项目。
										</span>
									</div>
								</div>
							</div>
						</div>
						
						<div className={styles.join_us}>
							<div className={styles.join_title}>3.后端工程师</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.后端 API 开发；</div>
									<div>
										2.后端数据维护与处理；</div>
									<div>
										3.后端框架开发；</div>
									<div>
										4.后端相关测试；</div>
									<div>
										5.技术文档编写。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										<div>
											1.本科及以上学历，计算机，数学相关专业；</div>
										<div>
											2.有扎实的编程能力，至少掌握 C/C++, Java, Go 中的一种编程语言， Go 语言者优先；</div>
										<div>
											3.熟练掌握基础的数据结构和算法（树，图，排序等）；</div>
										<div>
											4.有独立分析问题、定位并解决问题的能力；</div>
										<div>
											5.对技术有激情、勇于解决技术难题，思路清晰，责任心强。</div>
										<div>
											&nbsp;</div>
										<div>
											有编程竞赛获奖经历者优先考虑，例如 ACM、中国大学生程序设计大赛、蓝桥杯、CCF 相关竞赛或 CCF 等级考试、PAT 等级考试。</div>
									</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>
								4.后端工程师（数据抓取方向）</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.数据抓取/补全。</div>
									<div>
										2.数据正确性/完整性自动化检查。</div>
									<div>
										3.自动抓取入库流程框架开发。</div>
									<div>
										4.数据统计框架开发。</div>
									<div>
										5.数据文档撰写。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										<div>
											1.本科及以上学历，计算机/数学方向专业优先。</div>
										<div>
											2.编程能力过硬，掌握至少一门强类型后端语言，如java、golang等。</div>
										<div>
											3.熟悉至少一种数据库连接操作，MongoDB优先。</div>
										<div>
											4.有数据清洗、数据处理、数据自动化监测经历优先。</div>
										<div>
											5.热爱编程。</div>
									</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>5.测试工程师</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1、制定项目的测试计划，保证产品测试工作的计划性与规范性;</div>
									<div>
										2、把握有关要求，详细编写测试用例，做好测试前的相应准备工作;</div>
									<div>
										3、搭建测试环境，保证测试环境的独立和维护测试环境的更新;</div>
									<div>
										4、执行测试，并及时评估软件的特性与缺陷;</div>
									<div>
										5、进行 bug 验证，督促开发部门解决问题;</div>
									<div>
										6、进行测试记录和相应文档编写。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										1、计算机及相关专业，本科及以上学历，计算机基础知识扎实；</div>
									<div>
										2、能吃苦耐劳，有一定的程序编写经验；</div>
									<div>
										3、熟悉产品结构及质量控制理论；</div>
									<div>
										4、善于制定测试计划，编制测试方案及用例，能够规范测试流程；</div>
									<div>
										5、熟悉压力测试，能够设计并配合开发人员做压力测试。</div>
									<div>
										6、熟练掌握测试工具的使用；熟练使用常用办公软件；</div>
									<div>
										7、具备良好的业务沟通和理解能力,有较强的责任感及进取精神。
										<br/>
									</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>
								6.技术支持实习生</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.学术大数据服务的技术支持，服务期间保持与用户的沟通，确保用户满意度；</div>
									<div>
										2.参与学术大数据服务的技术改进；</div>
									<div>
										3.项目的跟踪、内部协调；</div>
									<div>
										4.数据的抓取、数据处理和分析；</div>
									<div>
										5.用Excel等工具进行数据分析、挖掘、汇总报告；</div>
									<div>
										6.指派其他的任务。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										1.本科及以上学历；</div>
									<div>
										2.计算机相关专业或自学过常用的计算机语言；</div>
									<div>
										3.掌握一种以上数据处理语言，能熟练编辑HTML文件，熟悉Python;</div>
									<div>
										4.有时间观念，注重工作效率，执行力强，注重细节，善于总结；</div>
									<div>
										5.有强烈的责任心、积极主动的工作态度、优秀的学习能力；</div>
									<div>
										6.具备与用户交流的基本能力和态度，有服务意识；</div>
									<div>
										7.团队合作意识、沟通能力、解决问题的能力。</div>
									<div>
										实习时长至少在4~6个月，每周至少4天出勤。</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>7.媒体运营实习生（坐班或者远程）</div>
							<div>
								<div className={styles.join_need}>
									工作内容：</div>
								<div className={styles.join_list}>
									<div>
										协助完成“学术头条”微信公众号内容的选题、制作和发布。</div>
									<div>
										你能得到什么？</div>
									<div>
										了解学术传播媒体工作全流程</div>
									<div>
										结交一群志同道合的伙伴，交流科研与媒体传播经验</div>
									<div>
										接触最前沿的科学研究，采访世界顶级科学家</div>
									<div>
										有机会成为学术头条编辑或者转正</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									基本要求：</div>
								<div className={styles.join_list}>
									<div>
										<div>
											硕士及以上学历，优秀本科生也可申请，专业方向不限；</div>
										<div>
											中英文阅读写作能力佳；</div>
										<div>
											关注科研进展及学术生态，信息搜索能力佳；</div>
									</div>
									<div>
										<p className={styles.add_point}><strong>加分项：</strong></p>
										<p><span>有新媒体平台运营经验；</span></p>
										<p><span>有论文发表经验；</span></p>
										<p><span>有报道、科普写作经验；</span></p>
										<p><span>爱好阅读，知识面广，对自己专业领域之外的事物保持好奇心；</span></p>
										<p>
											<span>以上加分项不作硬性要求。</span>
											<span>如有相关作品，包括个人发表在微博、微信公众号等平台的作品，请随简历一并投递。</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>8.报告研究员实习生</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.应用大数据系统和工具，进行数据挖掘、数据分析与处理；</div>
									<div>
										2.调研，文献整理，政策解读，与领域内专家沟通；</div>
									<div>
										3.撰写大数据研究报告。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										1.本科及以上学历，有良好的文字功底，有咨询报告编写和公文撰写经验者优先；</div>
									<div>
										2.对人工智能、大数据及数据挖掘有浓厚兴趣和热情，计算机相关专业优先；</div>
									<div>
										3.熟悉并掌握基本的研究框架和方法，能够以清晰的逻辑进行研究；</div>
									<div>
										4.具备优秀的信息挖掘和整理能力，调研分析能力，以及访谈技巧；</div>
									<div>
										5.热爱本职工作，积极高效，善于沟通，自驱力强，抗压能力强。</div>
								</div>
							</div>
						</div>
					
						<div className={styles.join_us}>
							<div className={styles.join_title}>9.专职外部销售 1人</div>
							<div>
								<div className={styles.join_need}>
									岗位职责：</div>
								<div className={styles.join_list}>
									<div>
										1.推广和销售基于学术大数据的产品和服务，扩大用户数量，完成销售指标，销售手段包括但不限于电话、邮件、拜访、参会等方式；</div>
									<div>
										2.参加相关的市场推广活动或作会议报告进行产品/服务的宣传和介绍，必要情况下需要出差，频率约10〜20%；</div>
									<div>
										3.起草推广文案、案例、合同、技术服务方案等；</div>
									<div>
										4.签定合同，根据部门要求对合同进行归档管理；</div>
									<div>
										5.合同签定后引导用户与支持人员对接，确保每个合同顺利执行。</div>
									<div>
										6.按要求对销售工作进行计划、跟踪、记录、内部汇报等；</div>
									<div>
										7.指派的其它相关任务。</div>
								</div>
							</div>
							<div>
								<div className={styles.join_need}>
									岗位要求：</div>
								<div className={styles.join_list}>
									<div>
										<div>
											1.本科及以上学历，有硕士或博士学历优先，有在国内外学术期刊上论文发表的经历优先；</div>
										<div>
											2.5年以上学术圈（包括学术期刊、期刊中心、学术期刊出版平台、大学、学会、学术机构等）B2B项目销售经验；</div>
										<div>
											3.具备独立和客户做技术交流、产品/服务呈现、作会议报告的能力；</div>
										<div>
											4.有强烈的责任心和积极主动的工作态度；</div>
										<div>
											5.出色的沟通能力、学习能力、抗压能力、逻辑思维能力、解决问题的能力；</div>
										<div>
											6.能适应快的工作节奏；</div>
										<div>
											7.工作有条理，注重细节，执行力强；</div>
										<div>
											8.具有团队合作意识。</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.footer}>
					<strong><span className={styles.footerWord}>以上技术岗位同时接受实习生申请。</span></strong>
				</div>
			</div>
		</Layout>
  );
}

export default component()(JoinUs);
