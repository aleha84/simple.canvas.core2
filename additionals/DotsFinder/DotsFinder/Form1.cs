using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DotsFinder
{
    public partial class Form1 : Form
    {
        private const string ignoredHex = "#ffffff";

        public Form1()
        {
            InitializeComponent();
        }

        private async void btnSelectFile_Click(object sender, EventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.Filter = "Bmp files | *.bmp";
            dialog.Multiselect = false;
            if (dialog.ShowDialog() == DialogResult.OK)
            {
                lblSelectedFilePath.Text = dialog.FileName;
                await ProcessImage(dialog.FileName);
            }
        }

        private async Task ProcessImage(string path)
        {
            var pointsByColor = new Dictionary<string, List<Point>>();
            using (var bmp = Image.FromFile(path) as Bitmap)
            {
                for (var y = 0; y < bmp.Height; y++)
                {
                    for (var x = 0; x < bmp.Width; x++)
                    {
                        var pixel = bmp.GetPixel(x, y);
                        var key = $"#{pixel.R:X2}{pixel.G:X2}{pixel.B:X2}";
                        if (key.Equals(ignoredHex, StringComparison.InvariantCultureIgnoreCase))
                            continue;

                        List<Point> points;
                        if (!pointsByColor.TryGetValue(key, out points))
                        {
                            points = new List<Point>();
                            pointsByColor.Add(key, points);
                        }

                        points.Add(new Point(x, y));
                    }
                }
            }

            tbResult.Text = string.Join(Environment.NewLine, pointsByColor.Select(kv => $"{kv.Key}{Environment.NewLine}{ ( string.Join(", ", kv.Value.Select(p => $"new V2({p.X},{p.Y})"))) }"));

        }
    }
}
