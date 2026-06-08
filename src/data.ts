/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, World } from './types';

export const LESSONS: Record<string, Lesson[]> = {
  python: [
    {
      id: 'py1',
      title: 'Variables and Print Statements',
      description: 'Master storing statistics and displaying output logs in programming kingdoms.',
      theory: `In code bases, **variables** act like storage chests. They seal values under custom labels so we can query them later.
      
To print a value or command to the game console, use the **print()** function. 
For example:
\`\`\`python
hero_name = "Nico"
print(hero_name)
\`\`\`
Text should be enclosed in straight double quotes \`"\` or single quotes \`'\`.`,
      visualExplanation: 'Under the hood, memory creates a slot named "hero_name" containing the binary value "Nico". Calling print fetches this slot and pipes it to standard output.',
      examples: [
        { title: 'Declaring scores', code: 'score = 10\nprint(score)', explanation: 'Saves 10 into score chest, then outputs 10 onto the client log.' }
      ],
      quiz: {
        question: 'Which of the following is the correct way to output "GO" in Python?',
        options: ['print("GO")', 'system.output("GO")', 'echo "GO"', 'print GO'],
        correctIndex: 0,
        explanation: 'Variables must be output through the call print("GO") incorporating parentheses.'
      }
    },
    {
      id: 'py2',
      title: 'Pacing Actions with Loops',
      description: 'Avoid repetitive code scripts. Learn to walk multiple paces through iterator loops.',
      theory: `If we want our hero to pace multiple steps forwards, we do not need to write copy-pasting statements. We can use a **for loop** combined with **range()**.

\`\`\`python
for step in range(3):
    print("WALK")
\`\`\`
This iterates three times, giving the coordinates dynamic steps.`,
      visualExplanation: 'An iterator keeps index = 0, runs statements inside indented blocks, increases index, and loops until the constraint is met.',
      examples: [
        { title: 'Three step walk', code: 'for i in range(3):\n    walk_step()', explanation: 'Creates loop calling walk step multiple times sequentially.' }
      ],
      quiz: {
        question: 'How many iterations will for i in range(5) run?',
        options: ['4', '5', '6', 'Infinitely'],
        correctIndex: 1,
        explanation: 'range(5) counts from 0, 1, 2, 3, 4, representing exactly 5 iterations.'
      }
    },
    {
      id: 'py3',
      title: 'Conditional Branching with If-Else',
      description: 'Formulate choice frameworks branching coordinates dynamically based on filters.',
      theory: `Decisions in code employ conditional check paths using **if**, **elif** and **else** triggers.

\`\`\`python
power_level = 95
if power_level > 90:
    print("ULTRA STRIKE")
elif power_level > 50:
    print("LIGHT CUT")
else:
    print("DEFEND")
\`\`\`
Note that code belonging inside conditions is marked by **indentation spaces**.`,
      visualExplanation: 'A logical gate evaluates power_level > 90. Since it evaluates to True, the executive sequence diverts down the ULTRA STRIKE path.',
      examples: [
        { title: 'Checking HP levels', code: 'hp = 25\nif hp < 30:\n    print("LOW_HEALTH")', explanation: 'Tests if current health is critical, and displays alerts.' }
      ],
      quiz: {
        question: 'What keyword represents the "ELSE IF" statement in Python syntax?',
        options: ['else if', 'elseif', 'elif', 'or if'],
        correctIndex: 2,
        explanation: 'Python uses the keyword "elif" for compound conditional branches.'
      }
    },
    {
      id: 'py4',
      title: 'Packaging Logic in Functions',
      description: 'Isolate parameters and avoid code clutter using reusable declared functions.',
      theory: `To wrap statements under a single tag that can be computed repeatedly, use natural Python **functions**. Declare them using the **def** keyword.

\`\`\`python
def execute_swing(damage_factor):
    base_dmg = 20
    final_dmg = base_dmg * damage_factor
    return final_dmg

calculated_dmg = execute_swing(2.5)
\`\`\`
A parameter vector (damage_factor) is sent inside local namespace scopes, returning a final number.`,
      visualExplanation: 'A virtual sub-routine takes 2.5 input, processes base_dmg * 2.5, and passes the output scalar 50 back to the main thread.',
      examples: [
        { title: 'Declare simple adder', code: 'def add(a, b):\n    return a + b\nprint(add(5, 7))', explanation: 'Defines a simple additive utility module return values.' }
      ],
      quiz: {
        question: 'What keyword is used to send a computed value back to a function caller?',
        options: ['send', 'return', 'output', 'export'],
        correctIndex: 1,
        explanation: 'The "return" keyword immediately halts a function and emits result values back.'
      }
    }
  ],
  statistics: [
    {
      id: 'stat1',
      title: 'Mean, Median and Variance',
      description: 'Unlocking summary metrics to inspect distributions inside datasets.',
      theory: `Data metrics summarize chaotic arrays into simple, decision-ready points:
1. **Mean** (Average): Sum of samples divided by counts.
2. **Median**: The central value when sorted. Extremely robust against dramatic outliers.
3. **Variance**: Measures diffusion of samples from the mean. High variance represents wide variance spikes, while low means clustered points.`,
      visualExplanation: 'Imagine an array [2, 5, 8]. Average value = 5. Central value = 5. Difference metrics calculate how split each participant is.',
      examples: [
        { title: 'Median Calculation', code: 'import numpy as np\nSamples = [1, 2, 100]\nprint(np.median(samples))', explanation: 'Output is 2, since 100 acts as an outlier but doesn\'t disrupt central score.' }
      ],
      quiz: {
        question: 'Which parameter is robust against anomalous outliers?',
        options: ['Mean', 'Median', 'Variance', 'Standard Deviation'],
        correctIndex: 1,
        explanation: 'The median selects the middle value sequentially, ignoring dramatic outliers at the ends.'
      }
    },
    {
      id: 'stat2',
      title: 'Probability and Bayes Theorem',
      description: 'Evaluate uncertainty metrics and conditional distributions for smart models.',
      theory: `Probability represents likelihood metrics on events scale [0.0 to 1.0]. 
**Bayes\' Theorem** represents how we update prior beliefs after seeing new evidence:

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

- **P(A|B)**: Posterior probability (beliefs after observing evidence B).
- **P(B|A)**: Likelihood of seeing evidence B given theory A.
- **P(A)**: Prior belief probability.`,
      visualExplanation: 'Imagine a medical scanner testing for systemic glitches. Prior false positive rates update into a clear true probability using Bayes ratios.',
      examples: [
        { title: 'Bayes conditional model', code: 'prior_glitch = 0.05\nlikelihood_alert = 0.9\nmarginal_data = 0.1\nposterior = (likelihood_alert * prior_glitch) / marginal_data\nprint(posterior)', explanation: 'Calculates the real probability of a true glitch given scanner alert parameters.' }
      ],
      quiz: {
        question: 'Under Bayes Theorem, what is the term P(A|B) called?',
        options: ['Prior Probability', 'Likelihood Factor', 'Posterior Probability', 'Marginal Evidence'],
        correctIndex: 2,
        explanation: "P(A|B) represents the updated belief 'after' seeing evidence, i.e., Posterior probability."
      }
    },
    {
      id: 'stat3',
      title: 'Normal Distributions and Z-Scores',
      description: 'Model Gaussian bell curves and establish outlier outlier boundaries.',
      theory: `Many real-world datasets show a **Normal (Gaussian) Distribution**, resembling a symmetric bell curve:

$$\\mu = \\text{Mean}, \\quad \\sigma = \\text{Standard Deviation}$$

A **Z-Score** measures exactly how many standard deviations an individual feature instance scales away from the central mean:

$$Z = \\frac{x - \\mu}{\\sigma}$$

Scores outside $[-3, 3]$ represent extreme outliers in typical processes.`,
      visualExplanation: '68% of overall patient metrics cluster within 1 standard deviation of the mean, whereas 99.7% inhabit 3 standard deviations.',
      examples: [
        { title: 'Evaluate Z-Score', code: 'mean_val = 100\nstd_dev = 15\npatient_score = 130\nz = (patient_score - mean_val) / std_dev\nprint(z)', explanation: 'Z-score is 2.0, meaning the sample is exactly 2 standard deviations above mean parameters.' }
      ],
      quiz: {
        question: 'Around what percentage of data falls within +/- 1 standard deviation in a normal distribution curve?',
        options: ['50%', '68%', '95%', '99.7%'],
        correctIndex: 1,
        explanation: 'According to empirical distribution rules, exactly ~68% of standard Gaussian values fit within one standard deviation.'
      }
    }
  ],
  math_ml: [
    {
      id: 'math1',
      title: 'Vectors and Linear Shifts',
      description: 'Learn dimensions and coordinate offsets that feed neural networks weight grids.',
      theory: `Multi-dimensional items are represented as **vectors**. In a game world, a character's position is a 2D vector:
\`\`\`python
pos = [x, y]
\`\`\`
Matrix multiplication maps translation, zoom-ins, and rotational angles on vectors, forming the basic math of deep graphics rendering and machine weight optimization.`,
      visualExplanation: 'Adding [2, -1] onto coordinates [5, 4] shifts the world grid vector to position [7, 3].',
      examples: [
        { title: 'Grid Translations', code: 'position = [10, 10]\noffset = [5, 0]\nnew_pos = [position[0] + offset[0], position[1]]', explanation: 'Moves candidate 5 steps right, raising absolute horizontal coordinate.' }
      ],
      quiz: {
        question: 'What is the sum of vectors [1, 2] and [3, 4]?',
        options: ['[4, 6]', '[3, 8]', '[4, 8]', '[2, 2]'],
        correctIndex: 0,
        explanation: 'Combine corresponding dimensions: [1+3, 2+4] = [4, 6].'
      }
    },
    {
      id: 'math2',
      title: 'Matrices and Dot Products',
      description: 'Master grid multiplication structures forming the computational foundations of networks.',
      theory: `A **matrix** is a 2D grid storing mathematical properties.
When we fit neural layers, the **dot product** of inputs vector and synapse weights matrix defines downstream firing:

$$Z = X \\cdot W = \\sum (X_i \\cdot W_i)$$

For matrix multiplication $A \\times B$, columns quantity of $A$ MUST match raw input rows quantity of $B$ exactly.`,
      visualExplanation: 'Multiplying an array of size (1, 3) against a weights matrix (3, 2) yields an output layer layer coordinates of size (1, 2).',
      examples: [
        { title: 'Matrix shapes validation', code: 'import numpy as np\na = np.array([[1, 2, 3]]) # (1,3)\nw = np.array([[1, 0], [2, 1], [0, 3]]) # (3,2)\nz = np.dot(a, w)\nprint(z.shape)', explanation: 'Confirm spatial resolution outputs array shape (1, 2) successfully.' }
      ],
      quiz: {
        question: 'If Matrix A has dimensions (4, 3) and Matrix B has dimensions (3, 5), what are the dimensions of product matrix AB?',
        options: ['(4, 3)', '(3, 5)', '(4, 5)', '(3, 3)'],
        correctIndex: 2,
        explanation: 'The inner dimensions match (3), and the outer dimensions define the product shape: (4, 5).'
      }
    },
    {
      id: 'math3',
      title: 'Calculus and Slopes Optimization',
      description: 'Navigate loss landscapes down to sweet coordinate spots using derivatives calculation.',
      theory: `Deep learning updates models using derivatives. A **derivative** representing the rate of change of a output given input adjustments.
We seek to minimize error metrics. The direction of maximum steep ascent is the mathematical **gradient**. Going negative of gradients (gradient descent) helps us descend to minimum error values.
The **Chain Rule** distributes backpropagating gradients through layered compositions of activation nodes.`,
      visualExplanation: 'Imagine an error parabola. Derivatives compute slopes. If local slope is positive, we step backward. If negative, we step forward to reach minimum loss valley.',
      examples: [
        { title: 'Updating weight slopes', code: 'weight = 12.0\nlearning_rate = 0.1\ngradient = 4.5\n# Step negative of gradient angle\nweight -= learning_rate * gradient\nprint(weight)', explanation: 'Minimizes weight value relative to local error derivative vectors, yielding 11.55.' }
      ],
      quiz: {
        question: 'What rule in calculus allows backpropagating loss gradients through deep layers of multiple equations?',
        options: ['The Product Rule', 'The Chain Rule', 'The Quotient Rule', 'The Power Matrix Rule'],
        correctIndex: 1,
        explanation: 'The Chain Rule tracks derivative factors upstream across functions cascades: dY/dx = (dY/du) * (du/dx).'
      }
    }
  ],
  data_science: [
    {
      id: 'ds1',
      title: 'Pandas Tabular Filtering',
      description: 'Sifting through clinical data files to classify metrics.',
      theory: `The premier library to filter structured tables is **Pandas**. Data is stored as a tabular frame called a **DataFrame**.
To query items under criteria (logical query filter):
\`\`\`python
high_quality = df[df['score'] > 80]
\`\`\`
This masks indices, retaining rows matching parameters.`,
      visualExplanation: 'Pandas aligns rows inside column maps. Filtering drops indexes that evaluate the condition to false state.',
      examples: [
        { title: 'Filtering ages', code: 'import pandas as pd\ndf = pd.read_csv("patients.csv")\nelderly = df[df["age"] >= 65]', explanation: 'Returns subset of patient dataframe containing citizens aged >= 65.' }
      ],
      quiz: {
        question: 'What keyword accesses rows of tabular frames inside Pandas?',
        options: ['.loc and boolean masks', 'search() method', 'scan() selector', 'find()'],
        correctIndex: 0,
        explanation: 'Pandas uses boolean filters and indexing attributes (.loc) to query rows.'
      }
    },
    {
      id: 'ds2',
      title: 'Data Normalization and Scaling',
      description: 'Rescale mismatched ranges to protect analytical algorithms from size bias.',
      theory: `When datasets contain mixed columns with divergent scale properties (e.g., age [1-100] versus annual revenues [10k-500k]), models fail.
We transform columns using scaling functions:
1. **Min-Max Normalization**: Scales features to fit precisely into an interval:

$$X_{\\text{scaled}} = \\frac{X - X_{\\text{min}}}{X_{\\text{max}} - X_{\\text{min}}}$$

2. **Standardization (Z-Score)**: Rescales to have 0.0 mean and 1.0 standard deviation.`,
      visualExplanation: 'A visual coordinate cluster gets rescaled into standard bounding limits, ensuring balance between elements.',
      examples: [
        { title: 'Scikit-Learn Scaling', code: 'from sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler()\nscaled_data = scaler.fit_transform(raw_matrix)', explanation: 'Transforms raw dataset vectors to reside strictly within [0, 1] range bounds.' }
      ],
      quiz: {
        question: 'Which scaling transforms parameters to have 0 mean and 1 variance?',
        options: ['Min-Max Scaling', 'StandardScaler Standardization', 'Binary thresholding', 'Log scaling'],
        correctIndex: 1,
        explanation: 'StandardScaler Standardization maps Gaussian features to fit 0 mean and 1 standard deviation.'
      }
    },
    {
      id: 'ds3',
      title: 'Cleaning Anomalies & Imputations',
      description: 'Triage empty NaN variables and recover database pipelines.',
      theory: `Real-world data files frequently host fractured empty cells, parsed as **NaN** (Not a Number). Our pipelines will crash unless we clean these:
- **Dropping rows**: Risk losing massive quantities of information.
- **Mean/Median Imputation**: Feed missing gaps with average metrics.
- **Constant Imputation**: Assign a fixed flag like 'UNKNOWN'.`,
      visualExplanation: 'The parsing engine patrols database cells. On detecting an empty null cell, it inserts the median score of that column to keep pipelines balanced.',
      examples: [
        { title: 'Pandas Fill Missing', code: 'import pandas as pd\ndf = pd.read_csv("stats.csv")\ndf["score"].fillna(df["score"].median(), inplace=True)', explanation: 'Replaces NaN empty cells in the score column with the central median values.' }
      ],
      quiz: {
        question: 'What is the statistical term for filling missing data points with estimated values?',
        options: ['Interpolation only', 'Imputation', 'Normalization', 'Data leakage'],
        correctIndex: 1,
        explanation: 'Imputation represents substituting missing datasets inputs with averages, medians, or constants.'
      }
    }
  ],
  machine_learning: [
    {
      id: 'ml1',
      title: 'Supervised vs Unsupervised Models',
      description: 'Differentiating labelled predictions against dynamic clustered groupings.',
      theory: `Systems configure models depending on target annotations:
- **Supervised Learning**: Learn matching functions mapping features **X** onto annotations **y** (e.g. classification class, risk metrics).
- **Unsupervised Learning**: Uncover structures, categories, or anomalies without label annotations (e.g. cluster user logs).`,
      visualExplanation: 'Supervised mapping has an answer key (e.g., target label in datasets). Unsupervised groups points into clusters using spatial distances (like Euclidean).',
      examples: [
        { title: 'Model fitting', code: 'from sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)', explanation: 'Trains regression weight values on labeled coordinates X_train and y_train.' }
      ],
      quiz: {
        question: 'Which method represents supervised classification?',
        options: ['Random Forest Classifier', 'K-Means Clustering', 'Principal Component Analysis (PCA)', 'Anomaly Detection Isolation Forest'],
        correctIndex: 0,
        explanation: 'Random Forest trains decision splits using annotated records to labels.'
      }
    },
    {
      id: 'ml2',
      title: 'Continuous Regression vs Class Logistic Fits',
      description: 'Build predictive fits predicting price targets vs probability outputs.',
      theory: `Sparsely grouped algorithms behave differently depending on categorical outputs:
1. **Linear Regression**: Fits continuous targets (e.g. market housing values).
2. **Logistic Regression**: Serves classification probabilities between 0.0 and 1.0 using the **Sigmoid** activation function:

$$S(z) = \\frac{1}{1 + e^{-z}}$$

If Sigmoid output is $\\ge 0.5$, we classify it as the positive class (1), otherwise negative class (0).`,
      visualExplanation: 'A linear line stretches infinitely. A sigmoid curves snugly into an S-curve, bounded precisely at 0 on the bottom and 1 at the top.',
      examples: [
        { title: 'Fitting classes', code: 'from sklearn.linear_model import LogisticRegression\nclf = LogisticRegression()\nclf.fit(X, y)\nprob = clf.predict_proba(new_sample)', explanation: 'Predicts the vector likelihood of belonging to class 0 or class 1.' }
      ],
      quiz: {
        question: 'What mathematical function maps real numbers onto a snugly bound [0.0 to 1.0] probability curve?',
        options: ['Hyperbolic Tangent', 'Sigmoid Function', 'Rectified Linear Unit (ReLU)', 'Exponential linear unit'],
        correctIndex: 1,
        explanation: 'The Sigmoid function squashes outputs to map cleanly inside a 0-1 probability range.'
      }
    },
    {
      id: 'ml3',
      title: 'Generalization & The Overfitting Dilemma',
      description: 'Mitigate training noise memorization using validation partitions and regularization.',
      theory: `Models can memorize training data perfectly while failing to predict unseen test records. This error is called **Overfitting** (High Variance).
Conversely, **Underfitting** (High Bias) behaves poorly even on training systems, as the model is too simple.
We resolve overfitting by:
- **Adding Regularization**: Punishing massive weights coefficients (L1 Lasso, L2 Ridge).
- **Split Partitions**: Splitting inputs strictly into Train, Validation, and Test sets.`,
      visualExplanation: 'An overfitted decision boundary curves and twists chaotically to wrap around every sample, failing to capture true trends.',
      examples: [
        { title: 'Ridge regularized fits', code: 'from sklearn.linear_model import Ridge\nreg = Ridge(alpha=1.0)\nreg.fit(X, y)', explanation: 'Ridge regression incorporates a weight penalty factor alpha to reduce overfitting.' }
      ],
      quiz: {
        question: 'What occurs when a machine learning model memorizes training dataset noise and fails to generalize to test data?',
        options: ['Underfitting', 'Overfitting', 'Data leakage', 'Perfect convergence'],
        correctIndex: 1,
        explanation: 'Overfitting occurs when high variance models absorb training noise, reducing real-world generalization.'
      }
    }
  ],
  deep_learning: [
    {
      id: 'dl1',
      title: 'What represents a Neuron?',
      description: 'Understanding activation biases shaping modern intelligent models.',
      theory: `A simulated **artificial neuron** mimics synapses in biology:
It computes the weighted sum of inputs relative to weights $W$ and bias $b$:
$$Z = \\sum (X_i * W_i) + b$$
The score goes into activation function like **ReLU** (Rectified Linear Unit) giving values $A = \\max(0, Z)$ which model non-linear boundaries.`,
      visualExplanation: 'An activation function introduces non-linearity. Real biological signals only fire after electrical potential bypass threshold boundaries.',
      examples: [
        { title: 'Simple ReLU implementation', code: 'def relu(x):\n    return max(0, x)', explanation: 'Caps negative values to zero, keeping positive grades unchanged.' }
      ],
      quiz: {
        question: 'What output is computed by ReLU for input value -4.5?',
        options: ['-4.5', '0.0', '4.5', '1.0'],
        correctIndex: 1,
        explanation: 'ReLU replaces all negative input numbers with 0.0.'
      }
    },
    {
      id: 'dl2',
      title: 'Neural Networks & Backpropagation',
      description: 'Update deep nested weight layers via continuous error feedback loops.',
      theory: `Single artificial nodes lack deep reasoning. Stack them in layout arrays to construct hidden hierarchies:
**Multi-Layer Perceptrons (MLPs)**.

We optimize these using **Backpropagation**:
1. **Forward Pass**: Compute outputs from inputs across layers.
2. **Loss Computation**: Measure output errors against real answers.
3. **Backward Pass**: Pass errors back using the **Chain Rule**, calculating derivatives to tweak every weight variable.`,
      visualExplanation: 'An error scalar at the output runs backward through synaptic grids, lighting up correction routes on nodes that caused the error.',
      examples: [
        { title: 'PyTorch simple forward backpass', code: 'import torch\nx = torch.randn(1, 4)\nw = torch.randn(4, 2, requires_grad=True)\nz = torch.matmul(x, w)\nloss = z.sum() # mock loss\nloss.backward() # Computes gradients\nprint(w.grad)', explanation: 'Executes backpropagation using PyTorch autodiff to calculate slopes.' }
      ],
      quiz: {
        question: 'Which algorithm distributes output error vectors back through hidden layers to update weight parameters?',
        options: ['Convolutions', 'Tokenization', 'Backpropagation', 'Inference'],
        correctIndex: 2,
        explanation: 'Backpropagation traces error coordinates backward relative to slopes, updating layers.'
      }
    },
    {
      id: 'dl3',
      title: 'Loss Functions and Optimizers',
      description: 'Configure mathematical score goals and adaptive learning rates with Adam.',
      theory: `Training requires an exact error definition, called a **Loss Function**:
- **Mean Squared Error (MSE)**: For continuous values predictions.
- **Binary Cross-Entropy**: For binary classification.

The **Optimizer** computes exactly how we adjust weights.
**Stochastic Gradient Descent (SGD)** uses fixed updates, while **Adam** adjusts learning rates dynamically per parameter by tracking historical gradients.`,
      visualExplanation: 'Adam tracks kinetic velocities and frictional gradients, scaling step size down on chaotic slopes and speeding up on smooth trails.',
      examples: [
        { title: 'Keras optimizer initialization', code: 'import tensorflow as tf\nopt = tf.keras.optimizers.Adam(learning_rate=0.001)\n# Keeps training steps adaptive and robust', explanation: 'Initializes the popular Adam solver with a steady local learning speed.' }
      ],
      quiz: {
        question: 'Which optimizer implements adaptive learning rates by adjusting historical gradients parameters?',
        options: ['Standard SGD', 'Adam', 'Linear Fits', 'Backpropagator'],
        correctIndex: 1,
        explanation: 'Adam combines RMSProp and Momentum concepts to adaptive update learning rates.'
      }
    }
  ],
  nlp: [
    {
      id: 'nlp1',
      title: 'Tokenization and Text Bags',
      description: 'Breaking words into numeric segments that embeddings map.',
      theory: `Algorithms cannot read direct text paragraphs. We must break streams of sentences into segments called **tokens** (e.g., words, characters):
\`\`\`python
sentence = "We learn neural paths"
tokens = sentence.split() # ["We", "learn", "neural", "paths"]
\`\`\`
Each unique token maps onto a vector ID in dictionaries, forming standard language models input indices.`,
      visualExplanation: 'Parsing splits rows on blank spacing, then maps matches onto fixed lookup indexes.',
      examples: [
        { title: 'Token list split', code: 'import re\nwords = re.findall(r"\\w+", "Adventure starts!")', explanation: 'Creates clean list containing alphanumeric word segments.' }
      ],
      quiz: {
        question: 'What is the standard name of mapping raw text to digital pieces?',
        options: ['Tokenization', 'Vector Cloning', 'Compilation', 'Subnetting'],
        correctIndex: 0,
        explanation: 'Tokenization extracts elements from raw character logs.'
      }
    },
    {
      id: 'nlp2',
      title: 'Dense Word Embeddings',
      description: 'Transition from sparse tokens to rich semantic dimensions.',
      theory: `Sparse representation (One-Hot vectors) fails to capture semantic meaning (e.g., 'cat' and 'kitty' are unrelated in One-Hot).
**Word Embeddings** map words into dense, continuous vectors of higher dimension (e.g., 512 dimensions). Synonymous items cluster near one another.
Mathematical operations capture relationships:

$$\\text{v("king")} - \\text{v("man")} + \\text{v("woman")} \\approx \\text{v("queen")}$$`,
      visualExplanation: 'The vector space clusters related entities. Geometric distances (cosine similarity) measure equivalence matches inside databases.',
      examples: [
        { title: 'Cosine Similarity metrics', code: 'import numpy as np\n# Cosine distance evaluation\ndef cosine_sim(v1, v2):\n    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))', explanation: 'Computes angular alignment between two semantic direction arrays.' }
      ],
      quiz: {
        question: 'What primary problem of One-Hot representations do Word Embeddings solve?',
        options: ['Excessive memory usage only', 'Inability to represent semantic relationships', 'Syntax compilation errors', 'Bypassing dictionaries'],
        correctIndex: 1,
        explanation: 'Embeddings map tokens into shared numeric spatial domains, capturing true semantic relationships.'
      }
    },
    {
      id: 'nlp3',
      title: 'Modern Transformers & Self-Attention',
      description: 'Discover the self-attention formula powering contemporary AI models.',
      theory: `Older sequence models (RNNs/LSTMs) processed phrases word-by-word sequentially.
The revolutionary **Transformer** architecture parallelizes text processing through **Self-Attention**:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

- **Q**: Query (words seeking contexts).
- **K**: Key (words offering contexts).
- **V**: Value (true information content).`,
      visualExplanation: 'For the word "bank" in "river bank", self-attention links "bank" to "river" instead of "finance", dynamically resolving ambiguous meanings.',
      examples: [
        { title: 'Query vector computation', code: 'import math\n# Simplified model weights dot matching\nscores = q_vector.dot(k_vector) / math.sqrt(64)\nprint(scores)', explanation: 'Calculates the attention scale correlation coefficient between key vectors.' }
      ],
      quiz: {
        question: 'What mechanism inside Transformers dynamically scores the contextual link between all words in a sentence?',
        options: ['Backpropagation', 'Self-Attention', 'Tokenization', 'Imputation'],
        correctIndex: 1,
        explanation: 'Self-Attention scores context alignments, empowering multi-token attention in parallel.'
      }
    }
  ],
  generative_ai: [
    {
      id: 'genai1',
      title: 'Large Language Models & Prompts',
      description: 'Master guidelines prompting AI models to serve clean JSON structures.',
      theory: `Generative models generate text by predicting the next highest probability token.
To customize their output formats, we use **System Instructions** and configure schema validation properties (like \`responseSchema\`), keeping API integrations deterministic and safe from structure failures.`,
      visualExplanation: 'Weights adjust parameters to select tokens with higher likelihood given surrounding contextual history.',
      examples: [
        { title: 'Custom schema request', code: 'config = {\n  "responseMimeType": "application/json"\n}', explanation: 'Tells the Gemini API engine to structure standard predictions into JSON.' }
      ],
      quiz: {
        question: 'Which method improves AI consistency with custom datasets?',
        options: ['Retrieval Augmented Generation (RAG)', 'String Concatenation', 'Increasing temperature', 'Bypassing tokens'],
        correctIndex: 0,
        explanation: 'RAG retrieves relevant reference sources, augmenting input prompts with factual records.'
      }
    },
    {
      id: 'genai2',
      title: 'Fine-Tuning and LoRA parameters',
      description: 'Tweak massive pre-trained model bases efficiently via low-rank updates.',
      theory: `Full fine-tuning of multi-billion parameter models is incredibly expensive.
**LoRA (Low-Rank Adaptation)** freezes the base pre-trained model weights ($W_0$) and injects pairs of small trainable rank decomposition matrices:

$$\\Delta W = B \\cdot A$$

This reduces the quantity of variables needing training optimization by more than 99%, without destroying reasoning quality.`,
      visualExplanation: 'Instead of altering a huge 4096 x 4096 matrix, LoRA tracks changes in dual matrices of size 4096 x 8 and 8 x 4096, cutting computational limits.',
      examples: [
        { title: 'PEFT LoRA Config', code: 'from peft import LoraConfig, get_peft_model\nconfig = LoraConfig(r=8, lora_alpha=32, target_modules=["q_proj", "v_proj"])\npeft_model = get_peft_model(model, config)', explanation: 'Enables high-efficiency training by binding low-rank parameters to query-value layers.' }
      ],
      quiz: {
        question: 'What is the primary benefit of LoRA weight tuning?',
        options: ['Decreases context window space', 'Reduces trainable parameter counts and memory usage', 'Eliminates prompt engineering completely', 'Bypasses tokenization steps'],
        correctIndex: 1,
        explanation: 'LoRA factorizes weight delta modifications into small rank matrices, heavily reducing trainable param sizes.'
      }
    },
    {
      id: 'genai3',
      title: 'Factual Grounding and RAG Systems',
      description: 'Inject real-time factual knowledge inside generative prompts.',
      theory: `Generative models suffer from "hallucinations" because they predict words based on likelihoods rather than querying facts.
**Retrieval-Augmented Generation (RAG)** fixes this:
1. **User input query** is converted to a vector embedding.
2. **Vector Database** retrieves documents matching the query (using similarity indexes).
3. **Prompt injection**: The real documents are parsed inside prompts, directing models to generate fully grounded responses.`,
      visualExplanation: 'The engine queries vector archives, extracts factual passages, and merges them into the system context, forcing the model to generate grounded answers.',
      examples: [
        { title: 'RAG Prompt construction', code: 'context = db.query(user_vector)\nprompt = f"Refer closely to Context: {context}\\nQuestion: {user_query}"', explanation: 'Creates a fully grounded system instruction prompt.' }
      ],
      quiz: {
        question: 'How does a RAG system prevent models from generating fictional responses?',
        options: ['By executing backpropagation on-the-fly', 'By retrieving and anchoring prompts onto factual external documents', 'By increasing temperature parameters to maximum limits', 'By using One-Hot encoders'],
        correctIndex: 1,
        explanation: 'RAG injects verified external context documents into the prompt space, preventing model hallucinations.'
      }
    }
  ],
  computer_vision: [
    {
      id: 'cv1',
      title: 'Digital Capture Matrix Primitives',
      description: 'Explore pixels and digital grids that visual tracking targets.',
      theory: `A digital photograph is parsed by machines as a 3D matrix representing heights, widths, and color depth values (Red, Green, Blue arrays).
Pixel counts are integers ranging from 0 (solid dark) to 255 (maximum color saturation). Convolutional filters scan matrices to extract shapes, contours, and edges.`,
      visualExplanation: 'Filters run matrix multiplication over pixels, enhancing edges to register target objects.',
      examples: [
        { title: 'Check image dims', code: 'import cv2\nimg = cv2.imread("hero.png")\nprint(img.shape)', explanation: 'Extracts dimension parameters of the graphic array [Height, Width, ColorChannels].' }
      ],
      quiz: {
        question: 'What values represent clean pixel parameters in RGB channels?',
        options: ['0 to 255', '-1 to 1', '0.0 to 1.0 only', 'Any float'],
        correctIndex: 0,
        explanation: 'Standard digital coordinates store intensities across 8-bit registers, giving values 0 to 255.'
      }
    },
    {
      id: 'cv2',
      title: 'Convolutional Filters & Max-Pooling',
      description: 'Implement spatial scans over pixel grids to extract edge features.',
      theory: `Standard deep layers fail on images as they destroy spatial links when flattened.
**Convolutional Neural Networks (CNNs)** preserve 2D coordinate layouts by sliding small filter kernels (e.g. 3x3) over inputs.
**Max-Pooling** downsamples the resulting maps by selecting only the maximum values within receptive sub-grids. This reduces computational requirements while keeping important visual shapes.`,
      visualExplanation: 'A 2x2 Max-Pooling kernel extracts the single brightest pixel in each sub-region, reducing the height/width of output matrices by 50% while emphasizing sharp borders.',
      examples: [
        { title: 'TensorFlow CNN Layer', code: 'from tensorflow.keras import layers\nmodel = tf.keras.models.Sequential([\n    layers.Conv2D(32, (3,3), activation="relu"),\n    layers.MaxPooling2D((2,2))\n])', explanation: 'Chains visual convolution parameters to pooling layers to extract spatial characteristics.' }
      ],
      quiz: {
        question: 'What is the utility of a MaxPooling layer inside visual networks?',
        options: ['Performs token split operations', 'Downsamples spatial sizes, reducing computation and parameter counts', 'Normalizes colors to black and white', 'Updates weight gradients directly'],
        correctIndex: 1,
        explanation: 'MaxPooling extracts maximum activation coordinates in grid windows, lowering dimensional storage.'
      }
    },
    {
      id: 'cv3',
      title: 'Object Detection vs Segmentation',
      description: 'Master bounding-box coordinates against fine pixel class segmentation.',
      theory: `Modern computer vision performs specialized tasks depending on detection precision:
- **Image Classification**: Predict what major subject lives in the frame.
- **Object Detection**: Predict exact $[x, y, w, h]$ coordinates of bounding boxes around multiple target assets.
- **Semantic Segmentation**: Assigns every pixel a class label (e.g., separating roads, humans, trees) to create high-resolution prediction maps.`,
      visualExplanation: 'Image parsing identifies bounding boxes for cars (Object Detection) and isolates the road from pavements pixel-by-pixel (Semantic Segmentation).',
      examples: [
        { title: 'Extracting box parameters', code: 'boxes, classes, scores = yolo_model(camera_feed)\nfor box, score in zip(boxes, scores):\n    if score > 0.8: print(f"YOLO Box coords: {box}")', explanation: 'Queries a model like YOLO to list detected objects with high confidence scores.' }
      ],
      quiz: {
        question: 'What task is characterized by classifying every pixel in an image to its correct class map?',
        options: ['Standard Image Classification', 'Object Detection with boxes', 'Semantic Segmentation', 'Tokenization split'],
        correctIndex: 2,
        explanation: 'Semantic segmentation requires pixel-level labeling, drawing precise category boundary maps.'
      }
    }
  ]
};

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Python Kingdom",
    description: "Master variables, parameters, output prints, and pacing iterators of the python realms.",
    levels: [
      {
        id: "w1_l1",
        worldId: 1,
        levelNumber: 1,
        title: "The Awakening - Say GO!",
        description: "Your hero Aiden is facing a stone gate! Output the spell to activate movement.",
        challengeText: "Write a statement using print() that outputs \"GO\" to boot Aiden's feet forward.",
        language: "python",
        starterCode: "# Enable move animation by outputting 'GO'\n",
        expectedOutput: "GO",
        expectedAction: "move",
        testCases: [
          { validateFnStr: "code.includes('print(') && (code.includes('GO') || code.includes('go'))", errorMessage: "Ensure print('GO') statement has been implemented." }
        ],
        hint: "Type: print(\"GO\") and click Execute Code to parse results."
      },
      {
        id: "w1_l2",
        worldId: 1,
        levelNumber: 2,
        title: "Chest Locking - Set the Score",
        description: "An enchanted chest requires score values to unlock its brass mechanisms.",
        challengeText: "Declare a local variable 'score' and set it to exactly 10 to grab the golden chest.",
        language: "python",
        starterCode: "# Set your score parameter\n",
        expectedOutput: "Variable 'score' set to 10 successfully.",
        expectedAction: "collect",
        testCases: [
          { validateFnStr: "code.includes('score') && code.includes('10')", errorMessage: "Verify score = 10 syntax matches exactly." }
        ],
        hint: "Declare scores like: score = 10"
      },
      {
        id: "w1_l3",
        worldId: 1,
        levelNumber: 3,
        title: "Bridge Crossing - The Pace Loop",
        description: "A drawbridge is clicking continuously. You need multiple steps to cycle across and avoid pitfalls.",
        challengeText: "Write an iterator loop using 'for' that repeats 3 times to step over safely.",
        language: "python",
        starterCode: "# Implement a pacing loop to cross\n",
        expectedOutput: "Step 1..",
        expectedAction: "walk_loop",
        testCases: [
          { validateFnStr: "code.includes('for ') || code.includes('while ')", errorMessage: "Please integrate valid 'for' or 'while' looping structures." }
        ],
        hint: "Write: for step in range(3): print(step)"
      },
      {
        id: "w1_l4",
        worldId: 1,
        levelNumber: 4,
        title: "Path Decider - Guard Filters",
        description: "The city guard requires you to isolate healthy records before entering.",
        challengeText: "Use an 'if' condition statement block to attack the shadow barrier when damage > 50.",
        language: "python",
        starterCode: "damage = 75\n# Check if damage > 50 to attack\n",
        expectedOutput: "Condition check passed.",
        expectedAction: "attack",
        testCases: [
          { validateFnStr: "code.includes('if ') && code.includes('damage')", errorMessage: "Ensure to implement an 'if' statement on damage metric." }
        ],
        hint: "Write: if damage > 50: print('ATTACK')"
      },
      {
        id: "w1_l5",
        worldId: 1,
        levelNumber: 5,
        title: "Elevator Shift - Column Selections",
        description: "Define a secure function that coordinates leaping vectors onto floating city elevators.",
        challengeText: "Define a custom function using Python's 'def' keyword that schedules coordinates values.",
        language: "python",
        starterCode: "# Define function to jump elevator obstacles\n",
        expectedOutput: "Function registered.",
        expectedAction: "jump",
        testCases: [
          { validateFnStr: "code.includes('def ')", errorMessage: "Please formulate a custom function signature using 'def'." }
        ],
        hint: "Write: def jump_obstacle(): and ensure it registers properly."
      },
      {
        id: "w1_l6",
        worldId: 1,
        levelNumber: 6,
        title: "Optimization Shielding - Fitting Waves",
        description: "The Boss Robo-Goliath is deflecting physical strikes! Modify model parameters to adjust weights.",
        challengeText: "Create a dictionary or list named 'weights' to evaluate optimized path settings.",
        language: "python",
        starterCode: "# Adapt model weights to disrupt Goliath reflections\nweights = [5.0, 1.2]\n",
        expectedOutput: "Parameters adjusted.",
        expectedAction: "boss_fight",
        testCases: [
          { validateFnStr: "code.includes('weights')", errorMessage: "Verify weights variable contains mathematical properties." }
        ],
        hint: "Keep weights variable initialized, and call mock updates or methods to train weights."
      }
    ]
  },
  {
    id: 2,
    name: "Data Science City",
    description: "Sift datasets and compute central statistical values on parameters data sheets.",
    levels: [
      {
        id: "w2_l1",
        worldId: 2,
        levelNumber: 1,
        title: "Path Decider - Guard Filters",
        description: "The city guard requires you to isolate healthy records before entering.",
        challengeText: "Use an 'if' condition statement block to attack the shadow barrier when damage > 50.",
        language: "python",
        starterCode: "damage = 75\n# Check if damage > 50 to attack\n",
        expectedOutput: "Power-charging slash executed!",
        expectedAction: "attack",
        testCases: [
          { validateFnStr: "code.includes('if ') && code.includes('damage')", errorMessage: "Ensure to implement an 'if' statement on damage metric." }
        ],
        hint: "Write: if damage > 50: print('ATTACK')"
      },
      {
        id: "w2_l2",
        worldId: 2,
        levelNumber: 2,
        title: "Elevator Shift - Column Selections",
        description: "Define a secure function that coordinates leaping vectors onto floating city elevators.",
        challengeText: "Define a custom function using Python's 'def' keyword that schedules coordinates values.",
        language: "python",
        starterCode: "# Define function to jump elevator obstacles\n",
        expectedOutput: "Hero learned the 'jump()' sequence!",
        expectedAction: "jump",
        testCases: [
          { validateFnStr: "code.includes('def ')", errorMessage: "Please formulate a custom function signature using 'def'." }
        ],
        hint: "Write: def jump_obstacle(): and ensure it registers properly."
      }
    ]
  },
  {
    id: 3,
    name: "Machine Learning Lab",
    description: "Configure gradients and weights profiles to overcome simulated system barriers.",
    levels: [
      {
        id: "w3_l1",
        worldId: 3,
        levelNumber: 1,
        title: "Optimization Shielding - Fitting Waves",
        description: "The Boss Robo-Goliath is deflecting physical strikes! Modify model parameters to adjust weights.",
        challengeText: "Create a dictionary or list named 'weights' to evaluate optimized path settings.",
        language: "python",
        starterCode: "# Adapt model weights to disrupt Goliath reflections\nweights = [5.0, 1.2]\n",
        expectedOutput: "Parameters adjusted.",
        expectedAction: "boss_fight",
        testCases: [
          { validateFnStr: "code.includes('weights')", errorMessage: "Verify weights variable contains mathematical properties." }
        ],
        hint: "Keep weights variable initialized, and call mock updates or methods to train weights."
      }
    ]
  },
  {
    id: 4,
    name: "Deep Learning Universe",
    description: "Dodge laser grids using forward activations and backpropagate weight errors.",
    levels: [
      {
        id: "w4_l1",
        worldId: 4,
        levelNumber: 1,
        title: "Activation Overload",
        description: "Dodge laser grids by calculating activations parameters.",
        challengeText: "Implement a condition that filters laser frequency ranges using an 'if' check statement block.",
        language: "python",
        starterCode: "laser_freq = 430\n# Test if laser_freq exceeds 400 to change shields\n",
        expectedOutput: "Condition check passed.",
        expectedAction: "attack",
        testCases: [
          { validateFnStr: "code.includes('if ')", errorMessage: "Check conditions syntaxes inside your script." }
        ],
        hint: "An 'if laser_freq > 400:' statement evaluates perfectly."
      }
    ]
  },
  {
    id: 5,
    name: "Generative AI Galaxy",
    description: "Engage models and bypass constraints using fine-tuned weights configuration.",
    levels: [
      {
        id: "w5_l1",
        worldId: 5,
        levelNumber: 1,
        title: "Model Bootstrapping",
        description: "Boot model instances using print statements.",
        challengeText: "Write print statement outputting model initialization status text: \"GO\".",
        language: "python",
        starterCode: "# Echo GO parameters\n",
        expectedOutput: "GO",
        expectedAction: "move",
        testCases: [
          { validateFnStr: "code.includes('print(')", errorMessage: "Write standard output print calls." }
        ],
        hint: "Write: print('GO')"
      }
    ]
  },
  {
    id: 6,
    name: "AI Engineer Planet",
    description: "Launch systems of multi-agent loops and retrieve structured vector embeddings.",
    levels: [
      {
        id: "w6_l1",
        worldId: 6,
        levelNumber: 1,
        title: "Final Boss - Agent Coordination",
        description: "The core master database is offline. Use query codes to extract status scores.",
        challengeText: "Execute SQL queries selecting all items from a table called 'hero_stats'.",
        language: "sql",
        starterCode: "/* Write SQL statement here */\n",
        expectedOutput: "Executing Query:\nID\tName\tRole",
        expectedAction: "boss_fight",
        testCases: [
          { validateFnStr: "code.toLowerCase().includes('select')", errorMessage: "Ensure your sql query incorporates SELECT keywords." }
        ],
        hint: "Write: SELECT * FROM hero_stats;"
      }
    ]
  }
];

export const PRESET_BADGES = [
  { id: 'b1', name: 'Python Kingdom Novice', description: 'Solved variable chests levels inside World 1.', icon: '🐍' },
  { id: 'b2', name: 'Wrangler Pioneer', description: 'Completed conditional challenges in World 2.', icon: '📊' },
  { id: 'b3', name: 'Lab Inspector', description: 'Beaten Robo-Goliath in World 3 optimization fight.', icon: '🤖' },
  { id: 'b4', name: 'Master Certicate', description: 'Completed a customized AI roadmap curriculum.', icon: '🎓' }
];

export const MOCK_LEADERBOARD: any[] = [
  { rank: 1, username: "PyMaster_99", xp: 5400, level: 12, completedProjectsCount: 4, accuracy: 98 },
  { rank: 2, username: "DeepLearnerX", xp: 4800, level: 10, completedProjectsCount: 3, accuracy: 94 },
  { rank: 3, username: "NicoCompanion", xp: 4200, level: 9, completedProjectsCount: 2, accuracy: 91 },
  { rank: 4, username: "TabularWrangler", xp: 3500, level: 8, completedProjectsCount: 2, accuracy: 89 },
  { rank: 5, username: "NeuralNinja", xp: 2900, level: 6, completedProjectsCount: 1, accuracy: 85 }
];
